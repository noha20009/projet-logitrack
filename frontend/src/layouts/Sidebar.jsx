import { Box, Button, Drawer, Toolbar, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

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
      <Toolbar className="sidebar-toolbar">
        <Box className="sidebar-logo-row">
          <Box className="sidebar-logo-box">LT</Box>
          <Typography variant="h6" className="sidebar-brand">
            LogiTrack
          </Typography>
        </Box>
      </Toolbar>
      <Box className="sidebar-nav">
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
              className={`sidebar-item${active ? ' sidebar-item--active' : ''}`}
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
        className="sidebar-drawer sidebar-drawer--temporary"
      >
        {content}
      </Drawer>
      <Drawer variant="permanent" open className="sidebar-drawer sidebar-drawer--permanent">
        {content}
      </Drawer>
    </>
  )
}
