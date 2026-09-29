import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getGenres } from '../api/tmdb';
import { readStorage, writeStorage } from '../utils/storage';

const MovieContext = createContext(null);
const FAVORITES_KEY = 'marquee_favorites';
const LAST_SEARCH_KEY = 'marquee_last_search';

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []));
  const [lastSearch, setLastSearch] = useState(() => readStorage(LAST_SEARCH_KEY, ''));
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    writeStorage(FAVORITES_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(LAST_SEARCH_KEY, lastSearch);
  }, [lastSearch]);

  // genres are only used for the filter dropdown, so a failure here is not worth an error screen
  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev.filter((m) => m.id !== movie.id);
      }
      const { id, title, poster_path, release_date, vote_average } = movie;
      return [{ id, title, poster_path, release_date, vote_average }, ...prev];
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some((m) => m.id === id), [favorites]);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, lastSearch, setLastSearch, genres }),
    [favorites, toggleFavorite, isFavorite, lastSearch, genres]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  return useContext(MovieContext);
}