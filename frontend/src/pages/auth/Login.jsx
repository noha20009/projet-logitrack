import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiTruck, HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi'
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
      <div className="login-card">
        <div className="login-card-content">
          <div className="login-brand">
            <span className="login-brand-icon">
              <HiTruck size={40} />
            </span>
            <h1 className="login-title">LogiTrack</h1>
            <p className="login-subtitle">Gestion logistique sécurisée</p>
          </div>

          {error && <div className="alert alert--error login-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="login-fields">
              <div className={`login-field${errors.email ? ' login-field--error' : ''}`}>
                <label htmlFor="login-email">Email</label>
                <div className="login-field-input">
                  <span className="login-field-icon">
                    <HiMail size={20} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@logitack.global"
                  />
                </div>
                {errors.email && <span className="field-helper field-helper--error">{errors.email}</span>}
              </div>
              <div className={`login-field${errors.password ? ' login-field--error' : ''}`}>
                <label htmlFor="login-password">Mot de passe</label>
                <div className="login-field-input">
                  <span className="login-field-icon">
                    <HiLockClosed size={20} />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="field-helper field-helper--error">{errors.password}</span>}
              </div>
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" name="remember-me" />
                  Se souvenir de moi
                </label>
                <Link to="/login" className="login-forgot">
                  Mot de passe oublié ?
                </Link>
              </div>
              <button type="submit" className="login-submit" disabled={submitting}>
                {submitting ? 'Connexion...' : 'Se connecter'}
                {!submitting && <HiArrowRight size={20} />}
              </button>
            </div>
          </form>

          <p className="login-links">
            Pas encore de compte ?{' '}
            <Link to="/register" className="auth-link">
              S'inscrire
            </Link>
          </p>

          <p className="login-footer">
            Personnel autorisé uniquement.
            <br />
            Protégé par LogiTrack Security Systems.
          </p>
        </div>
      </div>
    </div>
  )
}
