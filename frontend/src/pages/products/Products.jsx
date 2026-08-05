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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WarningIcon from '@mui/icons-material/Warning'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteProduit,
  getByCategorie,
  getByPrix,
  getLowStock,
  getProduits,
} from '../../api/produitApi'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/constants'

export default function Products() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('nom')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'
  const canSeeLowStock = role === 'ADMIN' || role === 'MANAGER'

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, size, sort }
    let request
    if (lowStock) request = getLowStock(params)
    else if (category.trim()) request = getByCategorie(category.trim(), params)
    else if (price !== '') request = getByPrix(price, params)
    else request = getProduits(params)
    request.then(setData).finally(() => setLoading(false))
  }, [page, size, sort, category, price, lowStock])

  useEffect(() => {
    load()
  }, [load])

  const resetFilters = () => {
    setCategory('')
    setPrice('')
    setLowStock(false)
    setPage(0)
  }

  const changeFilter = (fn) => {
    setPage(0)
    fn()
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduit(toDelete.id)
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
        <Typography variant="h4">Produits</Typography>
        {canWrite && (
          <Button component={Link} to="/products/new" variant="contained" startIcon={<AddIcon />}>
            Ajouter un produit
          </Button>
        )}
      </Stack>

      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="center">
          <SearchBar
            value={category}
            onChange={(v) => changeFilter(() => setCategory(v))}
            onSearch={() => changeFilter(() => {})}
            placeholder="Rechercher par catégorie..."
            label="Catégorie"
          />
          <TextField
            label="Prix exact (€)"
            type="number"
            value={price}
            onChange={(e) => changeFilter(() => setPrice(e.target.value))}
            sx={{ maxWidth: 160 }}
          />
          {canSeeLowStock && (
            <ToggleButtonGroup
              value={lowStock ? 'low' : ''}
              exclusive
              onChange={(_, v) => changeFilter(() => setLowStock(v === 'low'))}
              size="small"
            >
              <ToggleButton value="low">
                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} /> Stock faible
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <Button variant="outlined" onClick={() => { resetFilters(); setTimeout(load, 0) }}>
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
                    <TableCell>ID</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sort === 'nom'}
                        direction={sort === 'nom' ? 'asc' : 'desc'}
                        onClick={() => setSort('nom')}
                      >
                        Nom
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sort === 'prix'}
                        direction={sort === 'prix' ? 'asc' : 'desc'}
                        onClick={() => setSort('prix')}
                      >
                        Prix
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sort === 'quantiteStock'}
                        direction={sort === 'quantiteStock' ? 'asc' : 'desc'}
                        onClick={() => setSort('quantiteStock')}
                      >
                        Stock
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Aucun produit trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.content?.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Link to={`/products/${product.id}`} style={{ fontWeight: 600, color: 'primary.main' }}>
                          {product.nom}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.categorie} size="small" />
                      </TableCell>
                      <TableCell>{formatPrice(product.prix)}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.quantiteStock}
                          size="small"
                          color={product.quantiteStock <= 5 ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Voir">
                          <IconButton size="small" onClick={() => navigate(`/products/${product.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {canWrite && (
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => navigate(`/products/${product.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDelete && (
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => setToDelete(product)}>
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
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer le produit « ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </Box>
  )
}
