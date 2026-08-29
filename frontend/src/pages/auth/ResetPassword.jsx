import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HiTruck, HiLockClosed, HiShieldCheck } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPassword } from '../../api/authApi'
import { resetPasswordSchema } from '../../utils/validation'
import '../auth/Login.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [message, setMessage] = useState(null)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  const onSubmit = async (values) => {
    if (!token) {
      setServerError("Lien de réinitialisation invalide ou manquant.")
      return
    }
    setServerError(null)
    setMessage(null)
    try {
      await resetPassword({ token, newPassword: values.newPassword })
      setMessage('Votre mot de passe a été réinitialisé avec succès.')
      setTimeout(() => navigate('/login'), 3000)
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
            <h1 className="login-title">Nouveau mot de passe</h1>
            <p className="login-subtitle">
              Choisissez un nouveau mot de passe pour votre compte
            </p>
          </div>

          {message && <div className="alert alert--success login-error">{message}</div>}
          {serverError && <div className="alert alert--error login-error">{serverError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">
              <div className={`login-field${errors.newPassword ? ' login-field--error' : ''}`}>
                <label htmlFor="reset-password">Nouveau mot de passe</label>
                <div className="login-field-input">
                  <span className="login-field-icon">
                    <HiLockClosed size={20} />
                  </span>
                  <input
                    id="reset-password"
                    type="password"
                    {...register('newPassword')}
                    placeholder="••••••••"
                  />
                </div>
                {errors.newPassword && (
                  <span className="field-helper field-helper--error">{errors.newPassword.message}</span>
                )}
              </div>
              <div className={`login-field${errors.confirmPassword ? ' login-field--error' : ''}`}>
                <label htmlFor="reset-confirm">Confirmer le mot de passe</label>
                <div className="login-field-input">
                  <span className="login-field-icon">
                    <HiShieldCheck size={20} />
                  </span>
                  <input
                    id="reset-confirm"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="field-helper field-helper--error">{errors.confirmPassword.message}</span>
                )}
              </div>
              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>

          <p className="login-links">
            Retour à la{' '}
            <Link to="/login" className="auth-link">
              page de connexion
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
