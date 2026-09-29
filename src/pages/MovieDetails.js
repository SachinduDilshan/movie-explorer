import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ErrorMessage from '../components/ErrorMessage';
import { IMG, getErrorMessage, getMovieDetails } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

function formatRuntime(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    setMovie(null);

    getMovieDetails(id)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, attempt]);

  // if someone opens a movie link directly there is no history to go back to
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/');
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" sx={{ height: { xs: 200, sm: 360 } }} />
        <Skeleton width="50%" height={56} sx={{ mt: 3 }} />
        <Skeleton width="85%" />
        <Skeleton width="75%" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={goBack}>
          Back
        </Button>
        <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />
      </Box>
    );
  }

  if (!movie) return null;

  const poster = IMG.poster(movie.poster_path);
  const backdrop = IMG.backdrop(movie.backdrop_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const director = movie.credits?.crew?.find((p) => p.job === 'Director')?.name;
  const cast = movie.credits?.cast?.slice(0, 12) ?? [];
  const videos = movie.videos?.results ?? [];
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube');
  const saved = isFavorite(movie.id);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, sm: 360 },
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'action.hover',
        }}
      >
        {backdrop && (
          <Box
            component="img"
            src={backdrop}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              `linear-gradient(to top, ${theme.palette.background.default} 0%, transparent 70%)`,
          }}
        />
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(0, 0, 0, 0.55)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.75)' },
          }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          mt: { xs: -8, sm: -14 },
          px: { xs: 1, sm: 3 },
        }}
      >
        {poster ? (
          <Box
            component="img"
            src={poster}
            alt={`${movie.title} poster`}
            sx={{
              width: { xs: 140, sm: 240 },
              aspectRatio: '2 / 3',
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: 6,
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              width: { xs: 140, sm: 240 },
              aspectRatio: '2 / 3',
              borderRadius: 2,
              bgcolor: 'action.hover',
              flexShrink: 0,
            }}
          />
        )}

        <Box sx={{ pt: { sm: 12 } }}>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.6rem' } }}>
            {movie.title}
          </Typography>
          {movie.tagline && (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
              {movie.tagline}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              mt: 1.5,
              color: 'text.secondary',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                color: 'text.primary',
                fontWeight: 700,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 20, color: '#e0a02c' }} />
              {rating}
            </Box>
            <span>{year}</span>
            {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
            {director && <span>Directed by {director}</span>}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {(movie.genres ?? []).map((g) => (
              <Chip key={g.id} label={g.name} size="small" variant="outlined" />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              disabled={!trailer}
              onClick={() => setTrailerOpen(true)}
            >
              {trailer ? 'Watch trailer' : 'No trailer available'}
            </Button>
            <Button
              variant="outlined"
              startIcon={saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(movie)}
              aria-pressed={saved}
            >
              {saved ? 'Saved' : 'Save to favorites'}
            </Button>
          </Box>

          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 1 }}>
            Overview
          </Typography>
          <Typography sx={{ maxWidth: 720, lineHeight: 1.7 }}>
            {movie.overview || 'No overview available for this title yet.'}
          </Typography>
        </Box>
      </Box>

      {cast.length > 0 && (
        <Box sx={{ mt: 5, px: { xs: 1, sm: 3 } }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Cast
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2.5,
              overflowX: 'auto',
              pb: 1.5,
              scrollSnapType: 'x proximity',
            }}
          >
            {cast.map((person) => (
              <Box
                key={person.cast_id ?? person.credit_id}
                sx={{ width: 96, flexShrink: 0, textAlign: 'center', scrollSnapAlign: 'start' }}
              >
                <Avatar
                  src={IMG.profile(person.profile_path)}
                  alt={person.name}
                  sx={{ width: 84, height: 84, mx: 'auto', mb: 1 }}
                >
                  {person.name[0]}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {person.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.25 }}>
                  {person.character}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {trailer && (
        <Dialog open={trailerOpen} onClose={() => setTrailerOpen(false)} fullWidth maxWidth="md">
          <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
            <Box sx={{ position: 'relative', pt: '56.25%' }}>
              {trailerOpen && (
                <Box
                  component="iframe"
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              component="a"
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on YouTube
            </Button>
            <Button onClick={() => setTrailerOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}