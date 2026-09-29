# Marquee

A movie explorer built with React and the TMDb API. Search for films, browse what is trending, filter by genre, year and rating, watch trailers and keep a favorites list.

Live demo: (add your Vercel or Netlify link here)

## Features

- Login screen with form validation (demo only, no backend)
- Trending movies, with a Load More button
- Search with debounce and infinite scroll
- Filter by genre, year and rating
- Movie details: overview, genres, runtime, director, cast and a YouTube trailer player
- Favorites saved in local storage
- Last search remembered between visits
- Light and dark mode, saved between visits
- Mobile-first layout with a bottom navigation bar on phones
- Friendly error messages with a retry button

## Tech stack

React (Create React App), React Router 6, Material UI 6, axios, Context API

## Getting started

1. Get a free API key from https://www.themoviedb.org/settings/api
2. Clone the repo and install dependencies:

   npm install

3. Create a file called .env.local in the project root:

   REACT_APP_TMDB_API_KEY=your_key_here

4. Start the app:

   npm start

## API usage

All requests go through src/api/tmdb.js using an axios instance.

- GET /trending/movie/week for the trending section
- GET /search/movie for search
- GET /discover/movie for the filtered view
- GET /movie/{id}?append_to_response=credits,videos for the details page
- GET /genre/movie/list for the genre filter

## State management

Three contexts live in src/context:

- ThemeContext: light or dark mode
- AuthContext: the logged in user
- MovieContext: favorites, the last search and the genre list

Paging logic for the movie lists is in the usePagedMovies hook.

## Notes

- The login is a front-end demo. Any username with 3 or more characters and any password with 6 or more characters is accepted, and the session is stored in local storage.
- Search results use infinite scroll. Trending and filtered results use a Load More button.
- On search results, genre and rating filters are applied to the results already loaded, because the TMDb search endpoint does not support them.
- The API key is used in the browser, so it is visible in the built bundle. That is fine for a free TMDb key, but do not reuse this approach for secret keys.

## Deployment

Deployed on Vercel. Add REACT_APP_TMDB_API_KEY under Project Settings, Environment Variables, then redeploy. vercel.json makes sure page refreshes work with React Router.