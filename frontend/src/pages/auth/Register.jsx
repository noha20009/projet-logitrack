import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Link, MenuItem, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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

  return (
    <Box className="register-bg">
      <Card className="register-card">
        <CardContent className="register-card-content">
          <Typography variant="h4" align="center" gutterBottom>
            LogiTrack
          </Typography>
          <Typography variant="body2" className="register-subtitle">
            Créez votre compte
          </Typography>

          {error && (
            <Alert severity="error" className="register-error">
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="register-fields">
              <div className="register-name-row">
                <TextField
                  label="Prénom"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  error={Boolean(errors.prenom)}
                  helperText={errors.prenom}
                />
                <TextField
                  label="Nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  error={Boolean(errors.nom)}
                  helperText={errors.nom}
                />
              </div>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label="Mot de passe"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <TextField
                select
                label="Rôle"
                name="role"
                value={form.role}
                onChange={handleChange}
                error={Boolean(errors.role)}
                helperText={errors.role}
              >
                {Object.keys(ROLES).map((role) => (
                  <MenuItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </MenuItem>
                ))}
              </TextField>
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {submitting ? 'Création...' : 'Créer le compte'}
              </Button>
            </div>
          </form>

          <Typography variant="body2" className="register-links">
            Déjà un compte ?{' '}
            <Link component={RouterLink} to="/login">
              Se connecter
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
