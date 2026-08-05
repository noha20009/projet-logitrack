import { Box, Button, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { Link } from 'react-router-dom'

export default function AccessDenied() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <LockIcon color="error" sx={{ fontSize: 72, mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Accès refusé
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained">
        Retour au tableau de bord
      </Button>
    </Box>
  )
}
