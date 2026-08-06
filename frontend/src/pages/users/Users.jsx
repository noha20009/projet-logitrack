import { useEffect, useState } from 'react'
import { HiTrash, HiUserAdd, HiX } from 'react-icons/hi'
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

  const fieldClass = (name) => `field${errors[name] ? ' field--error' : ''}`

  return (
    <div>
      <h1 className="page-title">Gestion des utilisateurs</h1>

      {error && (
        <div className="alert alert--error users-error">
          <span>{error}</span>
          <button type="button" className="alert-close" onClick={() => setError(null)} title="Fermer">
            <HiX size={18} />
          </button>
        </div>
      )}

      <div className="grid">
        <div className="col-xs-12 col-lg-4">
          <div className="ui-card">
            <div className="ui-card--pad">
              <h2 className="section-title">Ajouter un utilisateur</h2>
              <form onSubmit={onSubmit} noValidate>
                <div className="users-form-fields">
                  <div className="users-name-row">
                    <div className={fieldClass('prenom')}>
                      <label htmlFor="user-prenom">Prénom</label>
                      <input id="user-prenom" name="prenom" value={form.prenom} onChange={handleChange} />
                      {errors.prenom && <span className="field-helper field-helper--error">{errors.prenom}</span>}
                    </div>
                    <div className={fieldClass('nom')}>
                      <label htmlFor="user-nom">Nom</label>
                      <input id="user-nom" name="nom" value={form.nom} onChange={handleChange} />
                      {errors.nom && <span className="field-helper field-helper--error">{errors.nom}</span>}
                    </div>
                  </div>
                  <div className={fieldClass('email')}>
                    <label htmlFor="user-email">Email</label>
                    <input id="user-email" type="email" name="email" value={form.email} onChange={handleChange} />
                    {errors.email && <span className="field-helper field-helper--error">{errors.email}</span>}
                  </div>
                  <div className={fieldClass('password')}>
                    <label htmlFor="user-password">Mot de passe</label>
                    <input id="user-password" type="password" name="password" value={form.password} onChange={handleChange} />
                    {errors.password && <span className="field-helper field-helper--error">{errors.password}</span>}
                  </div>
                  <div className={fieldClass('role')}>
                    <label htmlFor="user-role">Rôle</label>
                    <select id="user-role" name="role" value={form.role} onChange={handleChange}>
                      {Object.keys(ROLES).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    {errors.role && <span className="field-helper field-helper--error">{errors.role}</span>}
                  </div>
                  <button type="submit" className="btn btn--primary">
                    <HiUserAdd size={18} /> Créer l'utilisateur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-lg-8">
          <div className="ui-card">
            <div className="ui-card--pad">
              <h2 className="section-title">Liste des utilisateurs ({users?.length || 0})</h2>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Aucun utilisateur.
                        </td>
                      </tr>
                    )}
                    {users?.map((user) => (
                      <tr key={user.id}>
                        <td>
                          {user.prenom} {user.nom}
                          {user.id === me?.id && <span className="chip chip--primary users-you-chip">Vous</span>}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            className="users-role-select"
                            value={user.role}
                            onChange={(e) => changeRole(user, e.target.value)}
                            disabled={user.id === me?.id}
                          >
                            {Object.keys(ROLES).map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title={user.id === me?.id ? 'Impossible de se supprimer soi-même' : 'Supprimer'}
                            disabled={user.id === me?.id}
                            onClick={() => setToDelete(user)}
                          >
                            <HiTrash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer l'utilisateur « ${toDelete?.prenom} ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
