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
import './Navbar.css'

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
    <AppBar position="sticky" className="navbar-appbar">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick} className="navbar-menu-button">
          <MenuIcon />
        </IconButton>
        <Box className="navbar-spacer">
          <Typography variant="h6" className="navbar-brand">
            LogiTrack
          </Typography>
        </Box>
        <Box className="navbar-actions">
          {user?.role && (
            <Chip
              label={ROLE_LABELS[user.role] || user.role}
              color={user.role === 'ADMIN' ? 'error' : user.role === 'MANAGER' ? 'secondary' : 'info'}
              size="small"
              className="navbar-role-chip"
            />
          )}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar className="navbar-avatar">{fullName.charAt(0) || 'U'}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled className="navbar-menu-user">
              <Box>
                <Typography variant="body2" className="navbar-user-name">
                  {fullName}
                </Typography>
                <Typography variant="caption" className="navbar-user-email">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile') }}>Mon profil</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" className="navbar-logout-icon" /> Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
