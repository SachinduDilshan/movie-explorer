import { useState } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';

const linkSx = {
  color: 'text.secondary',
  '&.active': { color: 'primary.main' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const { favorites } = useMovies();
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState(null);

  let navValue = false;
  if (pathname === '/') navValue = 'home';
  else if (pathname.startsWith('/favorites')) navValue = 'favorites';

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ width: '100%', maxWidth: 1536, mx: 'auto' }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h5"
            sx={{ color: 'text.primary', textDecoration: 'none', mr: 3 }}
          >
            FilmFlix
            <Box component="span" sx={{ color: 'primary.main' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
            <Button component={NavLink} to="/" end sx={linkSx}>
              Home
            </Button>
            <Button component={NavLink} to="/favorites" sx={linkSx}>
              Favorites{favorites.length > 0 ? ` (${favorites.length})` : ''}
            </Button>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton onClick={toggleMode} aria-label="Toggle light and dark mode">
                {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Open account menu">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 15,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              <MenuItem disabled>Signed in as {user.username}</MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchor(null);
                  logout();
                }}
              >
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* phones get a bottom bar, easier to reach with a thumb */}
      <Paper
        elevation={0}
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
        }}
      >
        <BottomNavigation showLabels value={navValue} sx={{ bgcolor: 'background.paper' }}>
          <BottomNavigationAction
            component={RouterLink}
            to="/"
            value="home"
            label="Home"
            icon={<HomeOutlinedIcon />}
          />
          <BottomNavigationAction
            component={RouterLink}
            to="/favorites"
            value="favorites"
            label="Favorites"
            icon={
              <Badge badgeContent={favorites.length} color="primary">
                <FavoriteBorderIcon />
              </Badge>
            }
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}