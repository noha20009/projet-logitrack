import { HiLockClosed } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import './AccessDenied.css'

export default function AccessDenied() {
  return (
    <div className="access-denied">
      <HiLockClosed className="access-denied-icon" />
      <h1 className="page-title">Accès refusé</h1>
      <p className="access-denied-message">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      <Link to="/dashboard" className="btn btn--primary">
        Retour au tableau de bord
      </Link>
    </div>
  )
}
