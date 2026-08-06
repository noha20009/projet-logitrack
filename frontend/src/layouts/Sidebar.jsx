import { DashboardIcon, PeopleIcon, InventoryIcon, ShoppingCartIcon, AdminPanelSettingsIcon, PersonIcon } from '../components/Icons'
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
      <div className="sidebar-toolbar">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-box">LT</div>
          <span className="sidebar-brand">LogiTrack</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                onClose?.()
                navigate(item.path)
              }}
              className={`sidebar-item${active ? ' sidebar-item--active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      <aside className={`sidebar-drawer sidebar-drawer--temporary${mobileOpen ? ' sidebar-drawer--open' : ''}`}>{content}</aside>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className="sidebar-drawer sidebar-drawer--permanent">{content}</aside>
    </>
  )
}
