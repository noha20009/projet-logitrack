import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" color="primary" sx={{ fontWeight: 800 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Page introuvable
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </Typography>
      <Button component={Link} to={isAuthenticated ? '/dashboard' : '/login'} variant="contained">
        Retour à l'accueil
      </Button>
    </Box>
  )
}
