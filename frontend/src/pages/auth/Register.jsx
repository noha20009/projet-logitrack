import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Link, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLES } from '../../utils/constants'

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  prenom: yup.string().required('Le prénom est obligatoire'),
  email: yup.string().email('Email invalide').required('L’email est obligatoire'),
  password: yup
    .string()
    .min(6, 'Au moins 6 caractères')
    .required('Le mot de passe est obligatoire'),
  role: yup.string().required('Le rôle est obligatoire'),
})

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: ROLES.AGENT },
  })

  const onSubmit = async (values) => {
    setError(null)
    setSubmitting(true)
    try {
      await registerUser(values)
      navigate('/dashboard', { replace: true })
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
            Créez votre compte
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Prénom"
                  {...register('prenom')}
                  error={Boolean(errors.prenom)}
                  helperText={errors.prenom?.message}
                />
                <TextField
                  label="Nom"
                  {...register('nom')}
                  error={Boolean(errors.nom)}
                  helperText={errors.nom?.message}
                />
              </Stack>
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
              <TextField
                select
                label="Rôle"
                {...register('role')}
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
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
            </Stack>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
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
