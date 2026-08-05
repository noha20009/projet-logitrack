import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { addProduitToCommande, deleteCommande, getCommande, updateStatut } from '../../api/commandeApi'
import { getProduits } from '../../api/produitApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { STATUT_LABELS, STATUTS, formatDate, formatPrice } from '../../utils/constants'
import './OrderDetails.css'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [products, setProducts] = useState([])
  const [produitId, setProduitId] = useState('')
  const [quantite, setQuantite] = useState(1)
  const [adding, setAdding] = useState(false)
  const [toDelete, setToDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  const load = () => {
    setLoading(true)
    getCommande(id)
      .then((data) => {
        setOrder(data)
        setStatus(data.statut)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    if (canWrite) {
      getProduits({ page: 0, size: 100 }).then((data) => setProducts(data.content))
    }
  }, [])

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    setError(null)
    try {
      const updated = await updateStatut(id, newStatus)
      setOrder(updated)
      setStatus(updated.statut)
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddProduct = async () => {
    if (!produitId || !quantite) return
    setAdding(true)
    setError(null)
    try {
      await addProduitToCommande(id, produitId, Number(quantite))
      setProduitId('')
      setQuantite(1)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteCommande(id)
      navigate('/orders', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!order) return <Typography color="error">{error || 'Commande introuvable.'}</Typography>

  const total = order.lignes?.reduce((sum, l) => sum + l.quantite * l.produit.prix, 0) || 0

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} className="orders-back-button">
        Retour aux commandes
      </Button>

      <div className="order-details-header">
        <Typography variant="h4">Commande #{order.id}</Typography>
        {canDelete && (
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => setToDelete(true)}>
            Supprimer
          </Button>
        )}
      </div>

      {error && (
        <Alert severity="error" className="order-error">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <List dense>
                <ListItem divider>
                  <ListItemText primary="Client" secondary={order.client?.nom || '-'} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Email" secondary={order.client?.email || '-'} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Ville" secondary={order.client?.ville || '-'} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Date" secondary={formatDate(order.dateCommande)} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Statut"
                    secondary={
                      <FormControl fullWidth size="small" className="order-info-status">
                        <Select value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={updatingStatus}>
                          {STATUTS.map((s) => (
                            <MenuItem key={s} value={s}>
                              {STATUT_LABELS[s]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <div className="order-articles-header">
                <Typography variant="h6">Articles</Typography>
                <Typography variant="h6">
                  Total : {formatPrice(total)}
                </Typography>
              </div>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produit</TableCell>
                      <TableCell>Prix unitaire</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Sous-total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.lignes?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Aucun article dans cette commande.
                        </TableCell>
                      </TableRow>
                    )}
                    {order.lignes?.map((ligne) => (
                      <TableRow key={ligne.id} hover>
                        <TableCell>{ligne.produit.nom}</TableCell>
                        <TableCell>{formatPrice(ligne.produit.prix)}</TableCell>
                        <TableCell align="right">{ligne.quantite}</TableCell>
                        <TableCell align="right">{formatPrice(ligne.quantite * ligne.produit.prix)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {canWrite && (
                <div className="order-add-product">
                  <Typography variant="subtitle1" className="order-add-title">
                    Ajouter un produit
                  </Typography>
                  <div className="order-add-row">
                    <FormControl fullWidth size="small">
                      <InputLabel id="produit-select-label">Produit</InputLabel>
                      <Select
                        labelId="produit-select-label"
                        label="Produit"
                        value={produitId}
                        onChange={(e) => setProduitId(e.target.value)}
                      >
                        {products.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.nom} ({formatPrice(p.prix)})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Quantité"
                      type="number"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                      className="order-quantity"
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddProduct}
                      disabled={adding || !produitId}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer la commande"
        message={`Voulez-vous vraiment supprimer la commande n°${order.id} ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </Box>
  )
}
