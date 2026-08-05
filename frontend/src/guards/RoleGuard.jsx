import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleGuard({ roles, children }) {
  const { role } = useAuth()

  if (!roles.includes(role)) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}
