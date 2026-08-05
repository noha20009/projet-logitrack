import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createProduit, getProduit, updateProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  categorie: yup.string().required('La catégorie est obligatoire'),
  prix: yup
    .number()
    .typeError('Le prix doit être un nombre')
    .min(0, 'Le prix ne peut pas être négatif')
    .required('Le prix est obligatoire'),
  quantiteStock: yup
    .number()
    .typeError('La quantité doit être un nombre')
    .min(0, 'La quantité ne peut pas être négative')
    .integer('La quantité doit être un entier')
    .required('La quantité est obligatoire'),
})

export default function ProductForm() {
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
    getProduit(id)
      .then((product) =>
        reset({
          nom: product.nom,
          categorie: product.categorie,
          prix: product.prix,
          quantiteStock: product.quantiteStock,
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
        const updated = await updateProduit(id, values)
        navigate(`/products/${updated.id}`, { replace: true })
      } else {
        const created = await createProduit(values)
        navigate(`/products/${created.id}`, { replace: true })
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
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        Retour aux produits
      </Button>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
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
                label="Catégorie"
                {...register('categorie')}
                error={Boolean(errors.categorie)}
                helperText={errors.categorie?.message}
              />
              <TextField
                label="Prix (€)"
                type="number"
                inputProps={{ step: '0.01' }}
                {...register('prix')}
                error={Boolean(errors.prix)}
                helperText={errors.prix?.message}
              />
              <TextField
                label="Quantité en stock"
                type="number"
                {...register('quantiteStock')}
                error={Boolean(errors.quantiteStock)}
                helperText={errors.quantiteStock?.message}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => navigate('/products')} color="inherit">
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
