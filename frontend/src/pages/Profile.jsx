import { Avatar, Box, Card, CardContent, Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  const rows = [
    { label: 'Prénom', value: user.prenom },
    { label: 'Nom', value: user.nom },
    { label: 'Email', value: user.email },
  ]

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h4" gutterBottom>
        Mon profil
      </Typography>

      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28 }}>
              {`${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {user.prenom} {user.nom}
              </Typography>
              <Chip
                label={ROLE_LABELS[user.role] || user.role}
                color={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'secondary' : 'info'}
                size="small"
              />
            </Box>
          </Stack>

          <List dense>
            {rows.map((row) => (
              <ListItem key={row.label} divider>
                <ListItemText primary={row.label} secondary={row.value} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
