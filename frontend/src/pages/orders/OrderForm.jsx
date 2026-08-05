import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useNavigate } from 'react-router-dom'
import { getClients } from '../../api/clientApi'
import { createCommande } from '../../api/commandeApi'
import Loader from '../../components/Loader'

export default function OrderForm() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClients({ page: 0, size: 100, sort: 'nom' })
      .then((data) => setClients(data.content))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!clientId) return
    setSubmitting(true)
    setError(null)
    try {
      const order = await createCommande(clientId)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 2 }}>
        Retour aux commandes
      </Button>
      <Typography variant="h4" gutterBottom>
        Nouvelle commande
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sélectionnez le client puis créez la commande. Vous pourrez ensuite ajouter des produits dans le détail de la
            commande.
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                label="Client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                {clients.length === 0 && <MenuItem disabled>Aucun client disponible</MenuItem>}
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nom} — {c.ville || 'sans ville'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate('/orders')} color="inherit">
                Annuler
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleCreate}
                disabled={submitting || !clientId}
              >
                {submitting ? 'Création...' : 'Créer la commande'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
