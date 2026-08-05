import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const fullName = `${user?.prenom || ''} ${user?.nom || ''}`.trim()

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid #e2e8f0' }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 1, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            LogiTrack
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {user?.role && (
            <Chip
              label={ROLE_LABELS[user.role] || user.role}
              color={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'secondary' : 'info'}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            />
          )}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              {fullName.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled sx={{ minWidth: 180 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile') }}>Mon profil</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
