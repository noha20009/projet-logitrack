import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Link, useNavigate } from 'react-router-dom'
import { deleteCommande, getCommandes, getCommandesByClient } from '../../api/commandeApi'
import StatusFilter from '../../components/StatusFilter'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { STATUT_COLORS, STATUT_LABELS, formatDate } from '../../utils/constants'

export default function Orders() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('dateCommande')
  const [statut, setStatut] = useState('')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, size, sort, ...(statut ? { statut } : {}) }
    const request = clientId.trim() ? getCommandesByClient(clientId.trim(), params) : getCommandes(params)
    request.then(setData).finally(() => setLoading(false))
  }, [page, size, sort, statut, clientId])

  useEffect(() => {
    load()
  }, [load])

  const changeFilter = (fn) => {
    setPage(0)
    fn()
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteCommande(toDelete.id)
      setToDelete(null)
      if (data.content.length === 1 && page > 0) setPage(page - 1)
      else load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Commandes</Typography>
        {canWrite && (
          <Button component={Link} to="/orders/new" variant="contained" startIcon={<AddIcon />}>
            Nouvelle commande
          </Button>
        )}
      </Stack>

      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="center">
          <StatusFilter value={statut} onChange={(v) => changeFilter(() => setStatut(v))} />
          <TextField
            label="ID du client"
            type="number"
            value={clientId}
            onChange={(e) => changeFilter(() => setClientId(e.target.value))}
            sx={{ maxWidth: 160 }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setStatut('')
              setClientId('')
              setPage(0)
              setTimeout(load, 0)
            }}
          >
            Réinitialiser
          </Button>
        </Stack>

        {loading ? (
          <Loader />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sort === 'dateCommande'}
                        direction={sort === 'dateCommande' ? 'asc' : 'desc'}
                        onClick={() => setSort('dateCommande')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sort === 'statut'}
                        direction={sort === 'statut' ? 'asc' : 'desc'}
                        onClick={() => setSort('statut')}
                      >
                        Statut
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucune commande trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.content?.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <Link to={`/orders/${order.id}`} style={{ fontWeight: 600, color: 'primary.main' }}>
                          {order.client?.nom || '-'}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.dateCommande)}</TableCell>
                      <TableCell>
                        <Chip
                          label={STATUT_LABELS[order.statut] || order.statut}
                          color={STATUT_COLORS[order.statut] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir">
                          <IconButton size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {canDelete && (
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => setToDelete(order)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data && (
              <Pagination
                page={page}
                size={size}
                totalElements={data.totalElements}
                totalPages={data.totalPages}
                onPageChange={setPage}
                onSizeChange={(s) => { setSize(s); setPage(0) }}
              />
            )}
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer la commande"
        message={`Voulez-vous vraiment supprimer la commande n°${toDelete?.id} ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </Box>
  )
}
