import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function Favorites() {
  const { favorites } = useMovies();

  return (
    <Box>
      <Typography variant="h4" component="h1">
        Your favorites
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        {favorites.length === 0
          ? 'Nothing saved yet.'
          : `${favorites.length} saved ${favorites.length === 1 ? 'movie' : 'movies'}, stored on this device.`}
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <Typography sx={{ mb: 2 }}>
            Tap the heart on any poster and it will show up here.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Browse trending movies
          </Button>
        </Box>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Box>
  );
}