import { useEffect, useState } from 'react'
import { ArrowBackIcon, DeleteIcon, AddIcon } from '../../components/Icons'
import { useNavigate, useParams } from 'react-router-dom'
import { addProduitToCommande, deleteCommande, getCommande, updateStatut } from '../../api/commandeApi'
import { getProduits } from '../../api/produitApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { STATUT_LABELS, STATUTS, formatDate, formatPrice } from '../../utils/constants'
import './OrderDetails.css'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [products, setProducts] = useState([])
  const [produitId, setProduitId] = useState('')
  const [quantite, setQuantite] = useState(1)
  const [adding, setAdding] = useState(false)
  const [toDelete, setToDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  const load = () => {
    setLoading(true)
    getCommande(id)
      .then((data) => {
        setOrder(data)
        setStatus(data.statut)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    if (canWrite) {
      getProduits({ page: 0, size: 100 }).then((data) => setProducts(data.content))
    }
  }, [])

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    setError(null)
    try {
      const updated = await updateStatut(id, newStatus)
      setOrder(updated)
      setStatus(updated.statut)
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddProduct = async () => {
    if (!produitId || !quantite) return
    setAdding(true)
    setError(null)
    try {
      await addProduitToCommande(id, produitId, Number(quantite))
      setProduitId('')
      setQuantite(1)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteCommande(id)
      navigate('/orders', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!order) return <p className="text-danger">{error || 'Commande introuvable.'}</p>

  const total = order.lignes?.reduce((sum, l) => sum + l.quantite * l.produit.prix, 0) || 0

  return (
    <div>
      <button type="button" className="btn btn--ghost orders-back-button" onClick={() => navigate('/orders')}>
        <ArrowBackIcon size="sm" /> Retour aux commandes
      </button>

      <div className="order-details-header">
        <h1 className="page-title">Commande #{order.id}</h1>
        {canDelete && (
          <button type="button" className="btn btn--danger" onClick={() => setToDelete(true)}>
            <DeleteIcon size="sm" /> Supprimer
          </button>
        )}
      </div>

      {error && <div className="alert alert--error order-error">{error}</div>}

      <div className="grid">
        <div className="col-xs-12 col-md-4">
          <div className="ui-card">
            <div className="ui-card--pad">
              <h2 className="section-title">Informations</h2>
              <ul className="ui-list">
                <li>
                  <span className="list-label">Client</span>
                  <span className="list-value">{order.client?.nom || '-'}</span>
                </li>
                <li>
                  <span className="list-label">Email</span>
                  <span className="list-value">{order.client?.email || '-'}</span>
                </li>
                <li>
                  <span className="list-label">Ville</span>
                  <span className="list-value">{order.client?.ville || '-'}</span>
                </li>
                <li>
                  <span className="list-label">Date</span>
                  <span className="list-value">{formatDate(order.dateCommande)}</span>
                </li>
                <li className="order-info-status">
                  <span className="list-label">Statut</span>
                  <div className="field field--small order-info-status-select">
                    <select
                      id="order-status"
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={updatingStatus}
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {STATUT_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-md-8">
          <div className="ui-card">
            <div className="ui-card--pad">
              <div className="order-articles-header">
                <h2 className="section-title">Articles</h2>
                <span className="order-total">Total : {formatPrice(total)}</span>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th className="text-right">Quantité</th>
                      <th className="text-right">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.lignes?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Aucun article dans cette commande.
                        </td>
                      </tr>
                    )}
                    {order.lignes?.map((ligne) => (
                      <tr key={ligne.id}>
                        <td>{ligne.produit.nom}</td>
                        <td>{formatPrice(ligne.produit.prix)}</td>
                        <td className="text-right">{ligne.quantite}</td>
                        <td className="text-right">{formatPrice(ligne.quantite * ligne.produit.prix)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {canWrite && (
                <div className="order-add-product">
                  <h3 className="order-add-title">Ajouter un produit</h3>
                  <div className="order-add-row">
                    <div className="field">
                      <label htmlFor="order-add-product">Produit</label>
                      <select id="order-add-product" value={produitId} onChange={(e) => setProduitId(e.target.value)}>
                        <option value="">—</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nom} ({formatPrice(p.prix)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field order-quantity">
                      <label htmlFor="order-add-quantity">Quantité</label>
                      <input
                        id="order-add-quantity"
                        type="number"
                        value={quantite}
                        onChange={(e) => setQuantite(e.target.value)}
                      />
                    </div>
                    <button type="button" className="btn btn--primary" onClick={handleAddProduct} disabled={adding || !produitId}>
                      <AddIcon size="sm" /> Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer la commande"
        message={`Voulez-vous vraiment supprimer la commande n°${order.id} ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
