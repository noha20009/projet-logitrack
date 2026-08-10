import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiTruck, HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../context/AuthContext'
import { loginSchema } from '../../utils/validation'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      await login(values)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message)
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

          {serverError && <div className="alert alert--error login-error">{serverError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    {...register('email')}
                    placeholder="admin@logitack.global"
                  />
                </div>
                {errors.email && <span className="field-helper field-helper--error">{errors.email.message}</span>}
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
                    {...register('password')}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <span className="field-helper field-helper--error">{errors.password.message}</span>
                )}
              </div>
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" />
                  Se souvenir de moi
                </label>
              </div>
              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
                {!isSubmitting && <HiArrowRight size={20} />}
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
