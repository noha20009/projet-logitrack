import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Link, useNavigate } from 'react-router-dom'
import { getClients, searchClients, deleteClient } from '../../api/clientApi'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import './Clients.css'

export default function Clients() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('nom')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, size, sort }
    const request = search.trim() ? searchClients({ ...params, nom: search.trim() }) : getClients(params)
    request.then(setData).finally(() => setLoading(false))
  }, [page, size, sort, search])

  useEffect(() => {
    load()
  }, [load])

  const handleSearch = () => {
    setPage(0)
    load()
  }

  const handleSortChange = () => {
    setSort(sort === 'nom' ? 'id' : 'nom')
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteClient(toDelete.id)
      setToDelete(null)
      if (data.content.length === 1 && page > 0) setPage(page - 1)
      else load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box>
      <div className="clients-header">
        <Typography variant="h4">Clients</Typography>
        {canWrite && (
          <Button component={Link} to="/clients/new" variant="contained" startIcon={<AddIcon />}>
            Ajouter un client
          </Button>
        )}
      </div>

      <Card className="clients-card">
        <div className="clients-filters">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Rechercher par nom..."
            label="Rechercher un client"
          />
          <Button variant="outlined" onClick={() => { setSearch(''); setPage(0); setTimeout(load, 0) }}>
            Réinitialiser
          </Button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell sortDirection={sort}>
                      <TableSortLabel active={sort === 'nom'} direction={sort === 'nom' ? 'asc' : 'desc'} onClick={handleSortChange}>
                        Nom
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Ville</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Aucun client trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.content?.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>{client.id}</TableCell>
                      <TableCell>
                        <Link to={`/clients/${client.id}`} className="clients-table-link">
                          {client.nom}
                        </Link>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.telephone || '-'}</TableCell>
                      <TableCell>{client.ville || '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir">
                          <IconButton size="small" onClick={() => navigate(`/clients/${client.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {canWrite && (
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => navigate(`/clients/${client.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDelete && (
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => setToDelete(client)}>
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

      {!canWrite && data?.content?.length > 0 && (
        <Chip label="Seuls ADMIN et MANAGER peuvent créer ou modifier des clients." className="clients-info-chip" />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer le client"
        message={`Voulez-vous vraiment supprimer le client « ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </Box>
  )
}
