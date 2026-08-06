import { useEffect, useState } from 'react'
import { ArrowBackIcon, EditIcon, DeleteIcon } from '../../components/Icons'
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

  const load = () => {
    setLoading(true)
    Promise.all([getClient(id), getCommandesByClient(id, { page: 0, size: 50 })])
      .then(([clientData, ordersData]) => {
        setClient(clientData)
        setOrders(ordersData)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

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
  if (!client) return <p>Client introuvable.</p>

  const rows = [
    { label: 'Nom', value: client.nom },
    { label: 'Email', value: client.email },
    { label: 'Téléphone', value: client.telephone || '-' },
    { label: 'Ville', value: client.ville || '-' },
  ]

  return (
    <div>
      <button type="button" className="btn btn--ghost clients-back-button" onClick={() => navigate('/clients')}>
        <ArrowBackIcon size="sm" /> Retour aux clients
      </button>

      <div className="client-details-header">
        <h1 className="page-title">{client.nom}</h1>
        <div className="client-details-actions">
          {canWrite && (
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/clients/${id}/edit`)}>
              <EditIcon size="sm" /> Modifier
            </button>
          )}
          {canDelete && (
            <button type="button" className="btn btn--danger" onClick={() => setToDelete(true)}>
              <DeleteIcon size="sm" /> Supprimer
            </button>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="col-xs-12 col-md-5">
          <div className="ui-card">
            <div className="ui-card--pad">
              <h2 className="section-title">Informations</h2>
              <ul className="ui-list">
                {rows.map((row) => (
                  <li key={row.label}>
                    <span className="list-label">{row.label}</span>
                    <span className="list-value">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-md-7">
          <div className="ui-card">
            <div className="ui-card--pad">
              <h2 className="section-title">Commandes du client ({orders?.totalElements || 0})</h2>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th className="text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.content?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Aucune commande pour ce client.
                        </td>
                      </tr>
                    )}
                    {orders?.content?.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{formatDate(order.dateCommande)}</td>
                        <td>
                          <span className={`chip chip--${STATUT_COLORS[order.statut] || 'default'}`}>
                            {STATUT_LABELS[order.statut] || order.statut}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link to={`/orders/${order.id}`} className="icon-btn" title="Voir la commande">
                            <EditIcon size="sm" />
                          </Link>
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
        open={toDelete}
        title="Supprimer le client"
        message="Voulez-vous vraiment supprimer ce client ?"
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
