import { useEffect, useState } from 'react'
import { ArrowBackIcon, ShoppingCartIcon } from '../../components/Icons'
import { useNavigate } from 'react-router-dom'
import { getClients } from '../../api/clientApi'
import { createCommande } from '../../api/commandeApi'
import Loader from '../../components/Loader'
import './OrderForm.css'

export default function OrderForm() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClients({ page: 0, size: 100, sort: 'nom' })
      .then((data) => setClients(data.content))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!clientId) return
    setSubmitting(true)
    setError(null)
    try {
      const order = await createCommande(clientId)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="form-page">
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/orders')}>
        <ArrowBackIcon size="sm" /> Retour aux commandes
      </button>
      <h1 className="page-title">Nouvelle commande</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <p className="subtitle form-help">
            Sélectionnez le client puis créez la commande. Vous pourrez ensuite ajouter des produits dans le détail de la
            commande.
          </p>
          <div className="form-fields">
            <div className="field">
              <label htmlFor="order-client">Client</label>
              <select id="order-client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                {clients.length === 0 && <option value="">Aucun client disponible</option>}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} — {c.ville || 'sans ville'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/orders')}>
                Annuler
              </button>
              <button type="button" className="btn btn--primary" onClick={handleCreate} disabled={submitting || !clientId}>
                <ShoppingCartIcon size="sm" /> {submitting ? 'Création...' : 'Créer la commande'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
