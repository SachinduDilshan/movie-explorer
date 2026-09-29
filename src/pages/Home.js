import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid, { GridSkeleton } from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import { discoverMovies, getTrending, searchMovies } from '../api/tmdb';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import useDebounce from '../hooks/useDebounce';
import usePagedMovies from '../hooks/usePagedMovies';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const emptyFilters = { genre: '', year: '', rating: '' };

// the search endpoint has no genre or rating filter, so those are applied to loaded results
function applyFilters(movies, { genre, year, rating }) {
  return movies.filter((m) => {
    if (genre && !(m.genre_ids || []).includes(genre)) return false;
    if (year && !(m.release_date || '').startsWith(String(year))) return false;
    if (rating && m.vote_average < rating) return false;
    return true;
  });
}

export default function Home() {
  const { user } = useAuth();
  const { lastSearch, setLastSearch, genres } = useMovies();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(emptyFilters);

  const term = useDebounce(query, 500).trim();
  const filtersActive = Object.values(filters).some(Boolean);

  // three states: searching, browsing with filters, or plain trending
  const mode = term ? 'search' : filtersActive ? 'discover' : 'trending';
  const discoverFilters = mode === 'discover' ? filters : null;

  const fetchPage = useCallback(
    (page) => {
      if (mode === 'search') return searchMovies(term, page);
      if (mode === 'discover') return discoverMovies({ ...discoverFilters, page });
      return getTrending(page);
    },
    [mode, term, discoverFilters]
  );

  const { items, loading, error, hasMore, loadMore, retry } = usePagedMovies(fetchPage);

  useEffect(() => {
    if (term.length >= 2) setLastSearch(term);
  }, [term, setLastSearch]);

  const visible = useMemo(
    () => (mode === 'search' ? applyFilters(items, filters) : items),
    [items, filters, mode]
  );

  const sentinelRef = useInfiniteScroll(loadMore, mode === 'search' && items.length > 0);

  const headings = {
    search: `Results for "${term}"`,
    discover: 'Filtered picks',
    trending: 'Trending this week',
  };

  const showSkeleton = loading && items.length === 0;
  const showEmpty = !loading && !error && visible.length === 0 && !hasMore;

  return (
    <Box>
      <Box sx={{ maxWidth: 720, mb: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Hi {user.username}
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: '2rem', sm: '2.9rem' }, lineHeight: 1.1, mb: 2 }}
        >
          What are we watching tonight?
        </Typography>
        <SearchBar value={query} onChange={setQuery} />
        {!query && lastSearch && (
          <Chip
            label={`Last search: ${lastSearch}`}
            onClick={() => setQuery(lastSearch)}
            onDelete={() => setLastSearch('')}
            sx={{ mt: 1.5 }}
          />
        )}
      </Box>

      <FilterBar
        filters={filters}
        genres={genres}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        {headings[mode]}
      </Typography>

      {showSkeleton ? <GridSkeleton /> : <MovieGrid movies={visible} />}

      {showEmpty && (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
          {mode === 'search'
            ? `Nothing found for "${term}". Try a different title or loosen the filters.`
            : 'No movies match those filters. Try widening them a little.'}
        </Typography>
      )}

      {error && <ErrorMessage message={error} onRetry={retry} />}

      {mode !== 'search' && hasMore && !error && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </Box>
      )}

      {mode === 'search' && items.length > 0 && (
        <>
          <Box ref={sentinelRef} sx={{ height: 1 }} />
          {loading && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {!loading && !hasMore && !error && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              That is everything for this search.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}