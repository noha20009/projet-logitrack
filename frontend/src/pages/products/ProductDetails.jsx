import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteProduit, getProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/constants'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  useEffect(() => {
    getProduit(id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduit(id)
      navigate('/products', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!product) return <Typography>Produit introuvable.</Typography>

  const rows = [
    { label: 'Nom', value: product.nom },
    { label: 'Catégorie', value: product.categorie },
    { label: 'Prix', value: formatPrice(product.prix) },
    {
      label: 'Quantité en stock',
      value: product.quantiteStock,
      chip: product.quantiteStock <= 5,
    },
  ]

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        Retour aux produits
      </Button>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">{product.nom}</Typography>
        <Stack direction="row" spacing={1}>
          {canWrite && (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/products/${id}/edit`)}>
              Modifier
            </Button>
          )}
          {canDelete && (
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => setToDelete(true)}>
              Supprimer
            </Button>
          )}
        </Stack>
      </Stack>

      <Card sx={{ maxWidth: 560 }}>
        <CardContent>
          <List dense>
            {rows.map((row) => (
              <ListItem key={row.label} divider>
                <ListItemText primary={row.label} secondary={row.value} />
                {row.chip && <Chip label="Stock faible" color="error" size="small" />}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer le produit « ${product.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </Box>
  )
}
