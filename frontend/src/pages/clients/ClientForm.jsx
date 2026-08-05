import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createClient, getClient, updateClient } from '../../api/clientApi'
import Loader from '../../components/Loader'
import './ClientForm.css'

export default function ClientForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ nom: '', email: '', telephone: '', ville: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    getClient(id)
      .then((client) => {
        setForm({
          nom: client.nom,
          email: client.email,
          telephone: client.telephone || '',
          ville: client.ville || '',
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!form.email.trim()) {
      newErrors.email = 'L’email est obligatoire'
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email invalide'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        const updated = await updateClient(id, form)
        navigate(`/clients/${updated.id}`, { replace: true })
      } else {
        const created = await createClient(form)
        navigate(`/clients/${created.id}`, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <Box className="form-page">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')} className="form-back-button">
        Retour aux clients
      </Button>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Modifier le client' : 'Nouveau client'}
      </Typography>

      <Card>
        <CardContent className="form-card-content">
          {error && (
            <Alert severity="error" className="form-error">
              {error}
            </Alert>
          )}
          <form onSubmit={onSubmit} noValidate>
            <div className="form-fields">
              <TextField
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                error={Boolean(errors.nom)}
                helperText={errors.nom}
              />
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
                label="Téléphone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                error={Boolean(errors.telephone)}
                helperText={errors.telephone}
              />
              <TextField
                label="Ville"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                error={Boolean(errors.ville)}
                helperText={errors.ville}
              />
              <div className="form-actions">
                <Button onClick={() => navigate('/clients')} color="inherit">
                  Annuler
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
