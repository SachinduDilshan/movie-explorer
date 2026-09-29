import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function Login() {
  const { user, login } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.username.trim().length < 3) next.username = 'Username must be at least 3 characters.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) login(form.username);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          bgcolor: '#1b1613',
          color: '#f3eee4',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5">
          FilmFlix
          <Box component="span" sx={{ color: '#e8894a' }}>
            .
          </Box>
        </Typography>
        <Box sx={{ maxWidth: 420 }}>
          <Typography variant="h2" sx={{ fontSize: '3.2rem', lineHeight: 1.05 }}>
            Find something worth watching tonight.
          </Typography>
          <Typography sx={{ mt: 2, color: 'rgba(243, 238, 228, 0.7)' }}>
            Trending titles, quick search and a favorites list that stays on your device.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(243, 238, 228, 0.5)' }}>
          Created by <a href="https://github.com/SachinduDilshan" target="_blank" rel="noopener noreferrer">Sachindu Dilshan Abeyrathne</a> | Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a>
        </Typography>
        {/* film strip edge */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 14,
            width: 12,
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 14px, rgba(243, 238, 228, 0.16) 14px, rgba(243, 238, 228, 0.16) 30px)',
          }}
        />
      </Box>

      <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center', p: 3 }}>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton
            onClick={toggleMode}
            aria-label="Toggle light and dark mode"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 380 }}>
          <Typography variant="h4" component="h1">
            Sign in
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            This is a demo login with no backend. Any username and password that pass the checks will work.
          </Typography>

          <TextField
            fullWidth
            name="username"
            label="Username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            error={Boolean(errors.username)}
            helperText={errors.username}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" size="large" fullWidth>
            Sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
}