import { Box, CircularProgress } from '@mui/material'
import './Loader.css'

export default function Loader({ fullscreen = false }) {
  return (
    <Box className={`loader-container${fullscreen ? ' loader-container--fullscreen' : ''}`}>
      <CircularProgress />
    </Box>
  )
}
