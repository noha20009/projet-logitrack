import { Box, Button, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { Link } from 'react-router-dom'
import './AccessDenied.css'

export default function AccessDenied() {
  return (
    <Box className="access-denied">
      <LockIcon className="access-denied-icon" />
      <Typography variant="h4" gutterBottom>
        Accès refusé
      </Typography>
      <Typography className="access-denied-message">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained">
        Retour au tableau de bord
      </Button>
    </Box>
  )
}
