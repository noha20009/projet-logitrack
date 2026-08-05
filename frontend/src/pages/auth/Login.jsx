import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Link, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const schema = yup.object({
  email: yup.string().email('Email invalide').required('L’email est obligatoire'),
  password: yup.string().required('Le mot de passe est obligatoire'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (values) => {
    setError(null)
    setSubmitting(true)
    try {
      await login(values)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (e) {
      setError(e.message)
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">
              <TextField
                label="Email"
                type="email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Mot de passe"
                type="password"
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
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
