import { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createProduit, getProduit, updateProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'
import { productSchema } from '../../utils/validation'
import './ProductForm.css'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      nom: '',
      categorie: '',
      prix: '',
      quantiteStock: '',
    },
  })

  useEffect(() => {
    if (!isEdit) return
    getProduit(id)
      .then((product) => {
        reset({
          nom: product.nom,
          categorie: product.categorie,
          prix: product.prix,
          quantiteStock: product.quantiteStock,
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const onSubmit = async (values) => {
    setError(null)
    const payload = {
      nom: values.nom,
      categorie: values.categorie,
      prix: Number(values.prix),
      quantiteStock: Number(values.quantiteStock),
    }
    try {
      if (isEdit) {
        const updated = await updateProduit(id, payload)
        navigate(`/products/${updated.id}`, { replace: true })
      } else {
        const created = await createProduit(payload)
        navigate(`/products/${created.id}`, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader />

  const fieldClass = (name) => `field${errors[name] ? ' field--error' : ''}`

  return (
    <div className="form-page">
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/products')}>
        <HiArrowLeft size={18} /> Retour aux produits
      </button>
      <h1 className="page-title">{isEdit ? 'Modifier le produit' : 'Nouveau produit'}</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-fields">
              <div className={fieldClass('nom')}>
                <label htmlFor="product-nom">Nom</label>
                <input id="product-nom" {...register('nom')} />
                {errors.nom && <span className="field-helper field-helper--error">{errors.nom.message}</span>}
              </div>
              <div className={fieldClass('categorie')}>
                <label htmlFor="product-categorie">Catégorie</label>
                <input id="product-categorie" {...register('categorie')} />
                {errors.categorie && (
                  <span className="field-helper field-helper--error">{errors.categorie.message}</span>
                )}
              </div>
              <div className={fieldClass('prix')}>
                <label htmlFor="product-prix">Prix (€)</label>
                <input id="product-prix" type="number" step="0.01" {...register('prix')} />
                {errors.prix && <span className="field-helper field-helper--error">{errors.prix.message}</span>}
              </div>
              <div className={fieldClass('quantiteStock')}>
                <label htmlFor="product-quantite">Quantité en stock</label>
                <input id="product-quantite" type="number" step="1" {...register('quantiteStock')} />
                {errors.quantiteStock && (
                  <span className="field-helper field-helper--error">{errors.quantiteStock.message}</span>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/products')}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
