import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiTruck,
  HiUser,
  HiIdentification,
  HiMail,
  HiLockClosed,
  HiUserGroup,
  HiUserAdd,
} from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import { registerSchema } from '../../utils/validation'
import './Register.css'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      email: '',
      password: '',
      role: ROLES.AGENT,
    },
  })

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      await registerUser(values)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  const fieldClass = (name) => `register-field${errors[name] ? ' register-field--error' : ''}`

  return (
    <div className="register-bg">
      <div className="register-card">
        <div className="register-card-content">
          <div className="register-brand">
            <span className="register-brand-icon">
              <HiTruck size={40} />
            </span>
            <h1 className="register-title">LogiTrack</h1>
            <p className="register-subtitle">Créez votre compte</p>
          </div>

          {serverError && <div className="alert alert--error register-error">{serverError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="register-fields">
              <div className="register-name-row">
                <div className={fieldClass('prenom')}>
                  <label htmlFor="register-prenom">Prénom</label>
                  <div className="register-field-input">
                    <span className="register-field-icon">
                      <HiUser size={20} />
                    </span>
                    <input id="register-prenom" {...register('prenom')} />
                  </div>
                  {errors.prenom && <span className="field-helper field-helper--error">{errors.prenom.message}</span>}
                </div>
                <div className={fieldClass('nom')}>
                  <label htmlFor="register-nom">Nom</label>
                  <div className="register-field-input">
                    <span className="register-field-icon">
                      <HiIdentification size={20} />
                    </span>
                    <input id="register-nom" {...register('nom')} />
                  </div>
                  {errors.nom && <span className="field-helper field-helper--error">{errors.nom.message}</span>}
                </div>
              </div>
              <div className={fieldClass('email')}>
                <label htmlFor="register-email">Email</label>
                <div className="register-field-input">
                  <span className="register-field-icon">
                    <HiMail size={20} />
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    {...register('email')}
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && <span className="field-helper field-helper--error">{errors.email.message}</span>}
              </div>
              <div className={fieldClass('password')}>
                <label htmlFor="register-password">Mot de passe</label>
                <div className="register-field-input">
                  <span className="register-field-icon">
                    <HiLockClosed size={20} />
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <span className="field-helper field-helper--error">{errors.password.message}</span>
                )}
              </div>
              <div className={fieldClass('role')}>
                <label htmlFor="register-role">Rôle</label>
                <div className="register-field-input">
                  <span className="register-field-icon">
                    <HiUserGroup size={20} />
                  </span>
                  <select id="register-role" {...register('role')}>
                    {Object.keys(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && <span className="field-helper field-helper--error">{errors.role.message}</span>}
              </div>
              <button type="submit" className="register-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer le compte'}
                {!isSubmitting && <HiUserAdd size={20} />}
              </button>
            </div>
          </form>

          <p className="register-links">
            Déjà un compte ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>

          <p className="register-footer">
            Personnel autorisé uniquement.
            <br />
            Protégé par LogiTrack Security Systems.
          </p>
        </div>
      </div>
    </div>
  )
}
