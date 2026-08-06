import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NotFound.css'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="not-found">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page introuvable</h2>
      <p className="not-found-message">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn--primary">
        Retour à l'accueil
      </Link>
    </div>
  )
}
