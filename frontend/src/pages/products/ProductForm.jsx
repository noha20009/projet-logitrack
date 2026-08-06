import { useState } from 'react'
import { ArrowBackIcon } from '../../components/Icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createProduit, getProduit, updateProduit } from '../../api/produitApi'
import Loader from '../../components/Loader'
import './ProductForm.css'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ nom: '', categorie: '', prix: '', quantiteStock: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    getProduit(id)
      .then((product) => {
        setForm({
          nom: product.nom,
          categorie: product.categorie,
          prix: product.prix,
          quantiteStock: product.quantiteStock,
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nom.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!form.categorie.trim()) newErrors.categorie = 'La catégorie est obligatoire'
    if (form.prix === '' || isNaN(Number(form.prix))) {
      newErrors.prix = 'Le prix doit être un nombre'
    } else if (Number(form.prix) < 0) {
      newErrors.prix = 'Le prix ne peut pas être négatif'
    }
    if (form.quantiteStock === '' || isNaN(Number(form.quantiteStock))) {
      newErrors.quantiteStock = 'La quantité doit être un nombre'
    } else if (!Number.isInteger(Number(form.quantiteStock))) {
      newErrors.quantiteStock = 'La quantité doit être un entier'
    } else if (Number(form.quantiteStock) < 0) {
      newErrors.quantiteStock = 'La quantité ne peut pas être négative'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError(null)
    const payload = {
      nom: form.nom,
      categorie: form.categorie,
      prix: Number(form.prix),
      quantiteStock: Number(form.quantiteStock),
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
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  const fieldClass = (name) => `field${errors[name] ? ' field--error' : ''}`

  return (
    <div className="form-page">
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/products')}>
        <ArrowBackIcon size="sm" /> Retour aux produits
      </button>
      <h1 className="page-title">{isEdit ? 'Modifier le produit' : 'Nouveau produit'}</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <div className="form-fields">
              <div className={fieldClass('nom')}>
                <label htmlFor="product-nom">Nom</label>
                <input id="product-nom" name="nom" value={form.nom} onChange={handleChange} />
                {errors.nom && <span className="field-helper field-helper--error">{errors.nom}</span>}
              </div>
              <div className={fieldClass('categorie')}>
                <label htmlFor="product-categorie">Catégorie</label>
                <input id="product-categorie" name="categorie" value={form.categorie} onChange={handleChange} />
                {errors.categorie && <span className="field-helper field-helper--error">{errors.categorie}</span>}
              </div>
              <div className={fieldClass('prix')}>
                <label htmlFor="product-prix">Prix (€)</label>
                <input id="product-prix" type="number" name="prix" value={form.prix} onChange={handleChange} />
                {errors.prix && <span className="field-helper field-helper--error">{errors.prix}</span>}
              </div>
              <div className={fieldClass('quantiteStock')}>
                <label htmlFor="product-quantite">Quantité en stock</label>
                <input
                  id="product-quantite"
                  type="number"
                  name="quantiteStock"
                  value={form.quantiteStock}
                  onChange={handleChange}
                />
                {errors.quantiteStock && (
                  <span className="field-helper field-helper--error">{errors.quantiteStock}</span>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/products')}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
