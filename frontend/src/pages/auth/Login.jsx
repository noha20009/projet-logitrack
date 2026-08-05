import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

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
    <Box className="auth-bg">
      <Card className="auth-card">
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            LogiTrack
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Connectez-vous à votre espace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
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
            </Stack>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
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
