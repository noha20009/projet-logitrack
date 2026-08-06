import { useEffect, useState } from 'react'
import { ArrowBackIcon, EditIcon, DeleteIcon } from '../../components/Icons'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteProduit, getProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/constants'
import './ProductDetails.css'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'

  useEffect(() => {
    getProduit(id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduit(id)
      navigate('/products', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!product) return <p>Produit introuvable.</p>

  const rows = [
    { label: 'Nom', value: product.nom },
    { label: 'Catégorie', value: product.categorie },
    { label: 'Prix', value: formatPrice(product.prix) },
    {
      label: 'Quantité en stock',
      value: product.quantiteStock,
      chip: product.quantiteStock <= 5,
    },
  ]

  return (
    <div>
      <button type="button" className="btn btn--ghost products-back-button" onClick={() => navigate('/products')}>
        <ArrowBackIcon size="sm" /> Retour aux produits
      </button>

      <div className="product-details-header">
        <h1 className="page-title">{product.nom}</h1>
        <div className="product-details-actions">
          {canWrite && (
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/products/${id}/edit`)}>
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

      <div className="ui-card product-details-card">
        <div className="ui-card--pad">
          <ul className="ui-list">
            {rows.map((row) => (
              <li key={row.label}>
                <span className="list-label">{row.label}</span>
                <span className="list-value">
                  {row.value}
                  {row.chip && <span className="chip chip--error">Stock faible</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={toDelete}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer le produit « ${product.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
