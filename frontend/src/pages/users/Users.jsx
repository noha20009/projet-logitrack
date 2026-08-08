import { useEffect, useState } from 'react'
import { HiTrash, HiUserAdd, HiX } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createUser, deleteUser, getUsers, updateUserRole } from '../../api/userApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { ROLE_LABELS, ROLES } from '../../utils/constants'
import { userSchema } from '../../utils/validation'
import { useAuth } from '../../context/AuthContext'
import './Users.css'

export default function Users() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      email: '',
      password: '',
      role: ROLES.AGENT,
    },
  })

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

  const onSubmit = async (values) => {
    setError(null)
    try {
      await createUser(values)
      reset({ prenom: '', nom: '', email: '', password: '', role: ROLES.AGENT })
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
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="users-form-fields">
                  <div className="users-name-row">
                    <div className={fieldClass('prenom')}>
                      <label htmlFor="user-prenom">Prénom</label>
                      <input id="user-prenom" {...register('prenom')} />
                      {errors.prenom && <span className="field-helper field-helper--error">{errors.prenom.message}</span>}
                    </div>
                    <div className={fieldClass('nom')}>
                      <label htmlFor="user-nom">Nom</label>
                      <input id="user-nom" {...register('nom')} />
                      {errors.nom && <span className="field-helper field-helper--error">{errors.nom.message}</span>}
                    </div>
                  </div>
                  <div className={fieldClass('email')}>
                    <label htmlFor="user-email">Email</label>
                    <input id="user-email" type="email" {...register('email')} />
                    {errors.email && <span className="field-helper field-helper--error">{errors.email.message}</span>}
                  </div>
                  <div className={fieldClass('password')}>
                    <label htmlFor="user-password">Mot de passe</label>
                    <input id="user-password" type="password" {...register('password')} />
                    {errors.password && (
                      <span className="field-helper field-helper--error">{errors.password.message}</span>
                    )}
                  </div>
                  <div className={fieldClass('role')}>
                    <label htmlFor="user-role">Rôle</label>
                    <select id="user-role" {...register('role')}>
                      {Object.keys(ROLES).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    {errors.role && <span className="field-helper field-helper--error">{errors.role.message}</span>}
                  </div>
                  <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                    <HiUserAdd size={18} /> {isSubmitting ? 'Création...' : "Créer l'utilisateur"}
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
