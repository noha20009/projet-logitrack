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
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import './Register.css'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: ROLES.AGENT,
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire'
    if (!form.email.trim()) {
      newErrors.email = 'L’email est obligatoire'
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email invalide'
    }
    if (!form.password) {
      newErrors.password = 'Le mot de passe est obligatoire'
    } else if (form.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères'
    }
    if (!form.role) newErrors.role = 'Le rôle est obligatoire'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setError(null)
    setSubmitting(true)
    try {
      await registerUser(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
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

          {error && <div className="alert alert--error register-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="register-fields">
              <div className="register-name-row">
                <div className={fieldClass('prenom')}>
                  <label htmlFor="register-prenom">Prénom</label>
                  <div className="register-field-input">
                    <span className="register-field-icon">
                      <HiUser size={20} />
                    </span>
                    <input id="register-prenom" name="prenom" value={form.prenom} onChange={handleChange} />
                  </div>
                  {errors.prenom && <span className="field-helper field-helper--error">{errors.prenom}</span>}
                </div>
                <div className={fieldClass('nom')}>
                  <label htmlFor="register-nom">Nom</label>
                  <div className="register-field-input">
                    <span className="register-field-icon">
                      <HiIdentification size={20} />
                    </span>
                    <input id="register-nom" name="nom" value={form.nom} onChange={handleChange} />
                  </div>
                  {errors.nom && <span className="field-helper field-helper--error">{errors.nom}</span>}
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && <span className="field-helper field-helper--error">{errors.email}</span>}
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="field-helper field-helper--error">{errors.password}</span>}
              </div>
              <div className={fieldClass('role')}>
                <label htmlFor="register-role">Rôle</label>
                <div className="register-field-input">
                  <span className="register-field-icon">
                    <HiUserGroup size={20} />
                  </span>
                  <select id="register-role" name="role" value={form.role} onChange={handleChange}>
                    {Object.keys(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && <span className="field-helper field-helper--error">{errors.role}</span>}
              </div>
              <button type="submit" className="register-submit" disabled={submitting}>
                {submitting ? 'Création...' : 'Créer le compte'}
                {!submitting && <HiUserAdd size={20} />}
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
