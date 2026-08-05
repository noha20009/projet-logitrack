import { Box, CircularProgress } from '@mui/material'

export default function Loader({ fullscreen = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullscreen ? '100vh' : '300px',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  )
}
