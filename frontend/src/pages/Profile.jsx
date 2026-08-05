import { Avatar, Box, Card, CardContent, Chip, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  const rows = [
    { label: 'Prénom', value: user.prenom },
    { label: 'Nom', value: user.nom },
    { label: 'Email', value: user.email },
  ]

  return (
    <Box className="profile-page">
      <Typography variant="h4" gutterBottom>
        Mon profil
      </Typography>

      <Card>
        <CardContent>
          <div className="profile-header">
            <Avatar className="profile-avatar">
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
          </div>

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
