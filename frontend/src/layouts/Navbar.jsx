import { useEffect, useRef, useState } from 'react'
import { MenuIcon, LogoutIcon } from '../components/Icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'
import './Navbar.css'

function roleColor(role) {
  if (role === 'ADMIN') return 'error'
  if (role === 'MANAGER') return 'secondary'
  return 'info'
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const fullName = `${user?.prenom || ''} ${user?.nom || ''}`.trim()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  const goToProfile = () => {
    setOpen(false)
    navigate('/profile')
  }

  return (
    <header className="navbar-appbar">
      <div className="navbar-toolbar">
        <button type="button" className="icon-btn navbar-menu-button" onClick={onMenuClick} title="Menu">
          <MenuIcon />
        </button>
        <div className="navbar-spacer">
          <span className="navbar-brand">LogiTrack</span>
        </div>
        <div className="navbar-actions">
          {user?.role && (
            <span className={`chip navbar-role-chip chip--${roleColor(user.role)}`}>
              {ROLE_LABELS[user.role] || user.role}
            </span>
          )}
          <div className="navbar-menu" ref={menuRef}>
            <button type="button" className="avatar navbar-avatar" onClick={() => setOpen((v) => !v)}>
              {fullName.charAt(0) || 'U'}
            </button>
            {open && (
              <div className="navbar-dropdown">
                <div className="navbar-menu-user">
                  <div className="navbar-user-name">{fullName}</div>
                  <div className="navbar-user-email">{user?.email}</div>
                </div>
                <button type="button" className="navbar-dropdown-item" onClick={goToProfile}>
                  Mon profil
                </button>
                <button type="button" className="navbar-dropdown-item" onClick={handleLogout}>
                  <LogoutIcon size="sm" className="navbar-logout-icon" /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
