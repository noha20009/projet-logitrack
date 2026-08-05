import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteClient, getClient } from '../../api/clientApi'
import { getCommandesByClient } from '../../api/commandeApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { STATUT_COLORS, STATUT_LABELS, formatDate } from '../../utils/constants'
import './ClientDetails.css'

export default function ClientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [client, setClient] = useState(null)
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([getClient(id), getCommandesByClient(id, { page: 0, size: 50 })])
      .then(([clientData, ordersData]) => {
        setClient(clientData)
        setOrders(ordersData)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteClient(id)
      navigate('/clients', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!client) return <Typography>Client introuvable.</Typography>

  const rows = [
    { label: 'Nom', value: client.nom },
    { label: 'Email', value: client.email },
    { label: 'Téléphone', value: client.telephone || '-' },
    { label: 'Ville', value: client.ville || '-' },
  ]

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')} className="clients-back-button">
        Retour aux clients
      </Button>

      <div className="client-details-header">
        <Typography variant="h4">{client.nom}</Typography>
        <div className="client-details-actions">
          {canWrite && (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/clients/${id}/edit`)}>
              Modifier
            </Button>
          )}
          {canDelete && (
            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => setToDelete(true)}>
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <List dense>
                {rows.map((row) => (
                  <ListItem key={row.label} divider>
                    <ListItemText primary={row.label} secondary={row.value} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Commandes du client ({orders?.totalElements || 0})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>N°</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell align="right">Détails</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders?.content?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Aucune commande pour ce client.
                        </TableCell>
                      </TableRow>
                    )}
                    {orders?.content?.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{formatDate(order.dateCommande)}</TableCell>
                        <TableCell>
                          <Chip
                            label={STATUT_LABELS[order.statut] || order.statut}
                            color={STATUT_COLORS[order.statut] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Voir la commande">
                            <IconButton size="small" component={Link} to={`/orders/${order.id}`}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer le client"
        message="Voulez-vous vraiment supprimer ce client ?"
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </Box>
  )
}
