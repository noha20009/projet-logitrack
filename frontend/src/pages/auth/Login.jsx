import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire"
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email invalide'
    }
    if (!form.password) {
      newErrors.password = 'Le mot de passe est obligatoire'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setError(null)
    setSubmitting(true)
    try {
      await login(form)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="ui-card login-card">
        <div className="login-card-content">
          <h1 className="page-title login-title">LogiTrack</h1>
          <p className="subtitle login-subtitle">Connectez-vous à votre espace</p>

          {error && <div className="alert alert--error login-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="login-fields">
              <div className={`field${errors.email ? ' field--error' : ''}`}>
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-helper field-helper--error">{errors.email}</span>}
              </div>
              <div className={`field${errors.password ? ' field--error' : ''}`}>
                <label htmlFor="login-password">Mot de passe</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="field-helper field-helper--error">{errors.password}</span>}
              </div>
              <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
                {submitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <p className="login-links">
            Pas encore de compte ?{' '}
            <Link to="/register" className="auth-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
