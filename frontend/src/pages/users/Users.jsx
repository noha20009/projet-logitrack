import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { createUser, deleteUser, getUsers, updateUserRole } from '../../api/userApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import { useAuth } from '../../context/AuthContext'
import './Users.css'

export default function Users() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: ROLES.AGENT })
  const [errors, setErrors] = useState({})

  const load = () => {
    setLoading(true)
    getUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire'
    if (!form.email.trim()) {
      newErrors.email = 'L’email est obligatoire'
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email invalide'
    }
    if (!form.password) {
      newErrors.password = 'Le mot de passe est obligatoire'
    } else if (form.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères'
    }
    if (!form.role) newErrors.role = 'Le rôle est obligatoire'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setError(null)
    try {
      await createUser(form)
      setForm({ nom: '', prenom: '', email: '', password: '', role: ROLES.AGENT })
      setErrors({})
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const changeRole = async (user, role) => {
    try {
      await updateUserRole(user.id, role)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des utilisateurs
      </Typography>

      {error && (
        <Alert severity="error" className="users-error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ajouter un utilisateur
              </Typography>
              <form onSubmit={onSubmit} noValidate>
                <div className="users-form-fields">
                  <div className="users-name-row">
                    <TextField
                      label="Prénom"
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      error={Boolean(errors.prenom)}
                      helperText={errors.prenom}
                    />
                    <TextField
                      label="Nom"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      error={Boolean(errors.nom)}
                      helperText={errors.nom}
                    />
                  </div>
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
                    label="Mot de passe"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                  <TextField
                    select
                    label="Rôle"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    error={Boolean(errors.role)}
                    helperText={errors.role}
                  >
                    {Object.keys(ROLES).map((r) => (
                      <MenuItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button type="submit" variant="contained" startIcon={<PersonAddIcon />}>
                    Créer l'utilisateur
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Liste des utilisateurs ({users?.length || 0})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rôle</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Aucun utilisateur.
                        </TableCell>
                      </TableRow>
                    )}
                    {users?.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          {user.prenom} {user.nom}
                          {user.id === me?.id && <Chip label="Vous" size="small" color="primary" className="users-you-chip" />}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small" className="users-role-select">
                            <Select value={user.role} onChange={(e) => changeRole(user, e.target.value)} disabled={user.id === me?.id}>
                              {Object.keys(ROLES).map((r) => (
                                <MenuItem key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={user.id === me?.id ? 'Impossible de se supprimer soi-même' : 'Supprimer'}>
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={user.id === me?.id}
                                onClick={() => setToDelete(user)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
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
        open={Boolean(toDelete)}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer l'utilisateur « ${toDelete?.prenom} ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </Box>
  )
}
