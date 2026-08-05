import { Box, Button, Drawer, Toolbar, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const SIDEBAR_WIDTH = 260

export default function Sidebar({ mobileOpen, onClose }) {
  const { role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { label: 'Tableau de bord', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Clients', path: '/clients', icon: <PeopleIcon /> },
    { label: 'Produits', path: '/products', icon: <InventoryIcon /> },
    { label: 'Commandes', path: '/orders', icon: <ShoppingCartIcon /> },
    ...(role === 'ADMIN' ? [{ label: 'Utilisateurs', path: '/users', icon: <AdminPanelSettingsIcon /> }] : []),
    { label: 'Mon profil', path: '/profile', icon: <PersonIcon /> },
  ]

  const content = (
    <>
      <Toolbar sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            LT
          </Box>
          <Typography variant="h6" color="inherit" sx={{ fontWeight: 800 }}>
            LogiTrack
          </Typography>
        </Box>
      </Toolbar>
      <Box sx={{ p: 2 }}>
        {items.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <Button
              key={item.path}
              fullWidth
              onClick={() => {
                onClose?.()
                navigate(item.path)
              }}
              startIcon={item.icon}
              sx={{
                justifyContent: 'flex-start',
                color: 'white',
                mb: 0.5,
                bgcolor: active ? 'primary.main' : 'transparent',
                '&:hover': { bgcolor: active ? 'primary.main' : 'rgba(255,255,255,0.1)' },
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </Box>
    </>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', bgcolor: 'primary.dark', color: 'white' },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', bgcolor: 'primary.dark', color: 'white' },
        }}
      >
        {content}
      </Drawer>
    </>
  )
}
