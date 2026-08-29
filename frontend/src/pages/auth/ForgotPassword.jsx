import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiTruck, HiMail, HiKey } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { forgotPassword } from '../../api/authApi'
import { forgotPasswordSchema } from '../../utils/validation'
import '../auth/Login.css'

export default function ForgotPassword() {
  const [message, setMessage] = useState(null)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (values) => {
    setServerError(null)
    setMessage(null)
    try {
      const res = await forgotPassword(values)
      const text = res?.message || 'Les instructions ont été envoyées.'
      setMessage(text)
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
            <h1 className="login-title">Mot de passe oublié</h1>
            <p className="login-subtitle">
              Saisissez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {message && <div className="alert alert--success login-error">{message}</div>}
          {serverError && <div className="alert alert--error login-error">{serverError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">
              <div className={`login-field${errors.email ? ' login-field--error' : ''}`}>
                <label htmlFor="forgot-email">Email</label>
                <div className="login-field-input">
                  <span className="login-field-icon">
                    <HiMail size={20} />
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    {...register('email')}
                    placeholder="vous@entreprise.com"
                  />
                </div>
                {errors.email && <span className="field-helper field-helper--error">{errors.email.message}</span>}
              </div>
              <button type="submit" className="login-submit" disabled={isSubmitting}>
                <HiKey size={20} />
                {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </div>
          </form>

          <p className="login-links">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
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
