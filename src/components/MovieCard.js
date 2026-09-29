import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { IMG } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useMovies();
  const saved = isFavorite(movie.id);
  const poster = IMG.poster(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  return (
    <Box component="article" sx={{ position: 'relative' }}>
      <Box
        component={RouterLink}
        to={`/movie/${movie.id}`}
        sx={{
          display: 'block',
          color: 'inherit',
          textDecoration: 'none',
          borderRadius: 2,
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 3,
          },
          '@media (hover: hover)': {
            '&:hover .poster': { transform: 'scale(1.04)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '2 / 3',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
          }}
        >
          {poster ? (
            <Box
              component="img"
              className="poster"
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No poster available
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.75)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 16, color: '#f5b84b' }} />
            {rating}
          </Box>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            mt: 1,
            fontWeight: 700,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {year}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={() => toggleFavorite(movie)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          bgcolor: 'rgba(0, 0, 0, 0.55)',
          color: saved ? '#ff6b5e' : '#fff',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.75)' },
        }}
      >
        {saved ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
}