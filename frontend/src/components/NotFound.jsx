import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NotFound.css'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <Box className="not-found">
      <Typography variant="h2" className="not-found-code">
        404
      </Typography>
      <Typography variant="h5" className="not-found-title">
        Page introuvable
      </Typography>
      <Typography className="not-found-message">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </Typography>
      <Button component={Link} to={isAuthenticated ? '/dashboard' : '/login'} variant="contained">
        Retour à l'accueil
      </Button>
    </Box>
  )
}
