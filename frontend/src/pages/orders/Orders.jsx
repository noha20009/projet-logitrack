import { useCallback, useEffect, useState } from 'react'
import { HiPlus, HiTrash, HiEye } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { deleteCommande, getCommandes, getCommandesByClient } from '../../api/commandeApi'
import StatusFilter from '../../components/StatusFilter'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { STATUT_COLORS, STATUT_LABELS, formatDate } from '../../utils/constants'
import './Orders.css'

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
    <div>
      <div className="orders-header">
        <h1 className="page-title">Commandes</h1>
        {canWrite && (
          <Link to="/orders/new" className="btn btn--primary">
            <HiPlus size={18} /> Nouvelle commande
          </Link>
        )}
      </div>

      <div className="ui-card orders-card">
        <div className="orders-filters">
          <StatusFilter value={statut} onChange={(v) => changeFilter(() => setStatut(v))} />
          <div className="field order-client-id">
            <label htmlFor="order-client-id">ID du client</label>
            <input
              id="order-client-id"
              type="number"
              value={clientId}
              onChange={(e) => changeFilter(() => setClientId(e.target.value))}
            />
          </div>
          <button
            type="button"
            className="btn btn--outlined"
            onClick={() => {
              setStatut('')
              setClientId('')
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
                    <th>N°</th>
                    <th>Client</th>
                    <th>
                      <button
                        type="button"
                        className={`sort-btn${sort === 'dateCommande' ? ' sort-btn--active' : ''}`}
                        onClick={() => setSort('dateCommande')}
                      >
                        Date
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`sort-btn${sort === 'statut' ? ' sort-btn--active' : ''}`}
                        onClick={() => setSort('statut')}
                      >
                        Statut
                      </button>
                    </th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  )}
                  {data?.content?.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <Link to={`/orders/${order.id}`} className="table-link">
                          {order.client?.nom || '-'}
                        </Link>
                      </td>
                      <td>{formatDate(order.dateCommande)}</td>
                      <td>
                        <span className={`chip chip--${STATUT_COLORS[order.statut] || 'default'}`}>
                          {STATUT_LABELS[order.statut] || order.statut}
                        </span>
                      </td>
                      <td className="text-right">
                        <button type="button" className="icon-btn" title="Voir" onClick={() => navigate(`/orders/${order.id}`)}>
                          <HiEye size={18} />
                        </button>
                        {canDelete && (
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title="Supprimer"
                            onClick={() => setToDelete(order)}
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

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer la commande"
        message={`Voulez-vous vraiment supprimer la commande n°${toDelete?.id} ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
