import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Link, MenuItem, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import './Register.css'

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

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="register-fields">
              <div className="register-name-row">
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
              </div>
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
