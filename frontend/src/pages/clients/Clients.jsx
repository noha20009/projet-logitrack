import { useCallback, useEffect, useState } from 'react'
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi'
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
    <div>
      <div className="clients-header">
        <h1 className="page-title">Clients</h1>
        {canWrite && (
          <Link to="/clients/new" className="btn btn--primary">
            <HiPlus size={18} /> Ajouter un client
          </Link>
        )}
      </div>

      <div className="ui-card clients-card">
        <div className="clients-filters">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Rechercher par nom..."
            label="Rechercher un client"
          />
          <button
            type="button"
            className="btn btn--outlined"
            onClick={() => {
              setSearch('')
              setPage(0)
            }}
          >
            Réinitialiser
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      <button type="button" className={`sort-btn${sort === 'nom' ? ' sort-btn--active' : ''}`} onClick={handleSortChange}>
                        Nom
                      </button>
                    </th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Ville</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Aucun client trouvé.
                      </td>
                    </tr>
                  )}
                  {data?.content?.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>
                        <Link to={`/clients/${client.id}`} className="table-link">
                          {client.nom}
                        </Link>
                      </td>
                      <td>{client.email}</td>
                      <td>{client.telephone || '-'}</td>
                      <td>{client.ville || '-'}</td>
                      <td className="text-right">
                        <button type="button" className="icon-btn" title="Voir" onClick={() => navigate(`/clients/${client.id}`)}>
                          <HiEye size={18} />
                        </button>
                        {canWrite && (
                          <button
                            type="button"
                            className="icon-btn"
                            title="Modifier"
                            onClick={() => navigate(`/clients/${client.id}/edit`)}
                          >
                            <HiPencil size={18} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title="Supprimer"
                            onClick={() => setToDelete(client)}
                          >
                            <HiTrash size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <Pagination
                page={page}
                size={size}
                totalElements={data.totalElements}
                onPageChange={setPage}
                onSizeChange={(s) => {
                  setSize(s)
                  setPage(0)
                }}
              />
            )}
          </>
        )}
      </div>

      {!canWrite && data?.content?.length > 0 && (
        <p className="clients-info-chip">
          <span className="chip chip--info">Seuls ADMIN et MANAGER peuvent créer ou modifier des clients.</span>
        </p>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer le client"
        message={`Voulez-vous vraiment supprimer le client « ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
