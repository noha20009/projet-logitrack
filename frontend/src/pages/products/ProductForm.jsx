import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createProduit, getProduit, updateProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'
import './ProductForm.css'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ nom: '', categorie: '', prix: '', quantiteStock: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    getProduit(id)
      .then((product) => {
        setForm({
          nom: product.nom,
          categorie: product.categorie,
          prix: product.prix,
          quantiteStock: product.quantiteStock,
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
    if (!form.categorie.trim()) newErrors.categorie = 'La catégorie est obligatoire'
    if (form.prix === '' || isNaN(Number(form.prix))) {
      newErrors.prix = 'Le prix doit être un nombre'
    } else if (Number(form.prix) < 0) {
      newErrors.prix = 'Le prix ne peut pas être négatif'
    }
    if (form.quantiteStock === '' || isNaN(Number(form.quantiteStock))) {
      newErrors.quantiteStock = 'La quantité doit être un nombre'
    } else if (!Number.isInteger(Number(form.quantiteStock))) {
      newErrors.quantiteStock = 'La quantité doit être un entier'
    } else if (Number(form.quantiteStock) < 0) {
      newErrors.quantiteStock = 'La quantité ne peut pas être négative'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError(null)
    const payload = {
      nom: form.nom,
      categorie: form.categorie,
      prix: Number(form.prix),
      quantiteStock: Number(form.quantiteStock),
    }
    try {
      if (isEdit) {
        const updated = await updateProduit(id, payload)
        navigate(`/products/${updated.id}`, { replace: true })
      } else {
        const created = await createProduit(payload)
        navigate(`/products/${created.id}`, { replace: true })
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
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} className="form-back-button">
        Retour aux produits
      </Button>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
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
                label="Catégorie"
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
                error={Boolean(errors.categorie)}
                helperText={errors.categorie}
              />
              <TextField
                label="Prix (€)"
                type="number"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                error={Boolean(errors.prix)}
                helperText={errors.prix}
              />
              <TextField
                label="Quantité en stock"
                type="number"
                name="quantiteStock"
                value={form.quantiteStock}
                onChange={handleChange}
                error={Boolean(errors.quantiteStock)}
                helperText={errors.quantiteStock}
              />
              <div className="form-actions">
                <Button onClick={() => navigate('/products')} color="inherit">
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
