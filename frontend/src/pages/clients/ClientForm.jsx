import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createClient, getClient, updateClient } from '../../api/clientApi'
import Loader from '../../components/Loader'

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  email: yup.string().email('Email invalide').required('L’email est obligatoire'),
  telephone: yup.string().nullable(),
  ville: yup.string().nullable(),
})

export default function ClientForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (!isEdit) return
    getClient(id)
      .then((client) =>
        reset({
          nom: client.nom,
          email: client.email,
          telephone: client.telephone || '',
          ville: client.ville || '',
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const onSubmit = async (values) => {
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        const updated = await updateClient(id, values)
        navigate(`/clients/${updated.id}`, { replace: true })
      } else {
        const created = await createClient(values)
        navigate(`/clients/${created.id}`, { replace: true })
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')} sx={{ mb: 2 }}>
        Retour aux clients
      </Button>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Modifier le client' : 'Nouveau client'}
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Nom"
                {...register('nom')}
                error={Boolean(errors.nom)}
                helperText={errors.nom?.message}
              />
              <TextField
                label="Email"
                type="email"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                label="Téléphone"
                {...register('telephone')}
                error={Boolean(errors.telephone)}
                helperText={errors.telephone?.message}
              />
              <TextField
                label="Ville"
                {...register('ville')}
                error={Boolean(errors.ville)}
                helperText={errors.ville?.message}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => navigate('/clients')} color="inherit">
                  Annuler
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
