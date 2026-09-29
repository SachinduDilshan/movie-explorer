import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMG = {
  poster: (path) => (path ? `${IMAGE_BASE}/w342${path}` : null),
  backdrop: (path) => (path ? `${IMAGE_BASE}/w1280${path}` : null),
  profile: (path) => (path ? `${IMAGE_BASE}/w185${path}` : null),
};

// turns an axios error into something a normal person can read
export function getErrorMessage(err) {
  if (!err.response) {
    return 'Could not reach the movie service. Check your internet connection and try again.';
  }
  const { status } = err.response;
  if (status === 401) return 'The TMDb API key was rejected. Check the key in your .env.local file.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status === 429) return 'Too many requests right now. Give it a few seconds and try again.';
  return 'Something went wrong on the movie service. Please try again.';
}

export async function getTrending(page = 1) {
  const { data } = await api.get('/trending/movie/week', { params: { page } });
  return data;
}

export async function searchMovies(query, page = 1) {
  const { data } = await api.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

export async function discoverMovies({ genre, year, rating, page = 1 }) {
  const params = {
    page,
    sort_by: 'popularity.desc',
    include_adult: false,
    'vote_count.gte': 100, // keeps one-vote wonders out of the rating filter
  };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  if (rating) params['vote_average.gte'] = rating;

  const { data } = await api.get('/discover/movie', { params });
  return data;
}

export async function getMovieDetails(id) {
  const { data } = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
}

export async function getGenres() {
  const { data } = await api.get('/genre/movie/list');
  return data.genres;
}