import { useEffect, useState } from 'react'
import { HiArrowLeft, HiShoppingCart } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getClients } from '../../api/clientApi'
import { createCommande } from '../../api/commandeApi'
import Loader from '../../components/Loader'
import { orderSchema } from '../../utils/validation'
import './OrderForm.css'

export default function OrderForm() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      clientId: '',
    },
  })

  useEffect(() => {
    getClients({ page: 0, size: 100, sort: 'nom' })
      .then((data) => setClients(data.content))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (values) => {
    setError(null)
    try {
      const order = await createCommande(Number(values.clientId))
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="form-page">
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/orders')}>
        <HiArrowLeft size={18} /> Retour aux commandes
      </button>
      <h1 className="page-title">Nouvelle commande</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <p className="subtitle form-help">
            Sélectionnez le client puis créez la commande. Vous pourrez ensuite ajouter des produits dans le détail de la
            commande.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-fields">
              <div className={`field${errors.clientId ? ' field--error' : ''}`}>
                <label htmlFor="order-client">Client</label>
                <select id="order-client" {...register('clientId')}>
                  <option value="">— Sélectionner un client —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom} — {c.ville || 'sans ville'}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <span className="field-helper field-helper--error">{errors.clientId.message}</span>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/orders')}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  <HiShoppingCart size={18} /> {isSubmitting ? 'Création...' : 'Créer la commande'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
