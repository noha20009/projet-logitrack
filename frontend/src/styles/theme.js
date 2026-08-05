import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f766e',
    },
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    info: { main: '#0284c7' },
    background: {
      default: '#f1f5f9',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', borderRadius: 8, fontWeight: 600 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e2e8f0', borderRadius: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true },
    },
  },
})

export default theme
