import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'
import './Profile.css'

function roleColor(role) {
  if (role === 'ADMIN') return 'error'
  if (role === 'MANAGER') return 'secondary'
  return 'info'
}

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  const rows = [
    { label: 'Prénom', value: user.prenom },
    { label: 'Nom', value: user.nom },
    { label: 'Email', value: user.email },
  ]

  return (
    <div className="profile-page">
      <h1 className="page-title">Mon profil</h1>

      <div className="ui-card ui-card--pad">
        <div className="profile-header">
          <div className="avatar profile-avatar">
            {`${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`}
          </div>
          <div>
            <h2 className="profile-name">
              {user.prenom} {user.nom}
            </h2>
            <span className={`chip chip--${roleColor(user.role)}`}>{ROLE_LABELS[user.role] || user.role}</span>
          </div>
        </div>

        <ul className="ui-list">
          {rows.map((row) => (
            <li key={row.label}>
              <span className="list-label">{row.label}</span>
              <span className="list-value">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
