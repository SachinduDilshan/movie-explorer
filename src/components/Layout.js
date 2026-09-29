import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container
        component="main"
        maxWidth="xl"
        sx={{ flex: 1, pt: { xs: 2, sm: 4 }, pb: { xs: 11, sm: 6 } }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}