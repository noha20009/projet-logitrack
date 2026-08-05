import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Link, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
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
    <Box className="login-bg">
      <Card className="login-card">
        <CardContent className="login-card-content">
          <Typography variant="h4" align="center" gutterBottom>
            LogiTrack
          </Typography>
          <Typography variant="body2" className="login-subtitle">
            Connectez-vous à votre espace
          </Typography>

          {error && (
            <Alert severity="error" className="login-error">
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="login-fields">
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
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {submitting ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </form>

          <Typography variant="body2" className="login-links">
            Pas encore de compte ?{' '}
            <Link component={RouterLink} to="/register">
              S'inscrire
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
