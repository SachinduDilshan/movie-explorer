import { Box, Skeleton } from '@mui/material';
import MovieCard from './MovieCard';

const gridSx = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2.5 },
  gridTemplateColumns: {
    xs: 'repeat(2, 1fr)',
    sm: 'repeat(3, 1fr)',
    md: 'repeat(4, 1fr)',
    lg: 'repeat(5, 1fr)',
    xl: 'repeat(6, 1fr)',
  },
};

export default function MovieGrid({ movies }) {
  return (
    <Box sx={gridSx}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <Box sx={gridSx} aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto' }} />
          <Skeleton width="80%" sx={{ mt: 1 }} />
          <Skeleton width="30%" />
        </Box>
      ))}
    </Box>
  );
}