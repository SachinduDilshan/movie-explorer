import { createTheme } from '@mui/material/styles';

const serif = '"Fraunces", Georgia, serif';

const palettes = {
  light: {
    background: { default: '#f3eee4', paper: '#fffdf8' },
    text: { primary: '#211d18', secondary: '#6b6358' },
    primary: { main: '#b4441f', contrastText: '#ffffff' },
    divider: 'rgba(33, 29, 24, 0.12)',
  },
  dark: {
    background: { default: '#121110', paper: '#1c1a18' },
    text: { primary: '#ede7db', secondary: '#a39b8d' },
    primary: { main: '#e8894a', contrastText: '#1a1410' },
    divider: 'rgba(237, 231, 219, 0.12)',
  },
};

export function buildTheme(mode) {
  return createTheme({
    palette: { mode, ...palettes[mode] },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      h1: { fontFamily: serif, fontWeight: 700 },
      h2: { fontFamily: serif, fontWeight: 700 },
      h3: { fontFamily: serif, fontWeight: 700 },
      h4: { fontFamily: serif, fontWeight: 700 },
      h5: { fontFamily: serif, fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  });
}