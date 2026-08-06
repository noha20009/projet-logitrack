import { useState } from 'react'
import { ArrowBackIcon } from '../../components/Icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createClient, getClient, updateClient } from '../../api/clientApi'
import Loader from '../../components/Loader'
import './ClientForm.css'

export default function ClientForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ nom: '', email: '', telephone: '', ville: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    getClient(id)
      .then((client) => {
        setForm({
          nom: client.nom,
          email: client.email,
          telephone: client.telephone || '',
          ville: client.ville || '',
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
    if (!form.email.trim()) {
      newErrors.email = 'L’email est obligatoire'
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email invalide'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        const updated = await updateClient(id, form)
        navigate(`/clients/${updated.id}`, { replace: true })
      } else {
        const created = await createClient(form)
        navigate(`/clients/${created.id}`, { replace: true })
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
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/clients')}>
        <ArrowBackIcon size="sm" /> Retour aux clients
      </button>
      <h1 className="page-title">{isEdit ? 'Modifier le client' : 'Nouveau client'}</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <form onSubmit={onSubmit} noValidate>
            <div className="form-fields">
              <div className={fieldClass('nom')}>
                <label htmlFor="client-nom">Nom</label>
                <input id="client-nom" name="nom" value={form.nom} onChange={handleChange} />
                {errors.nom && <span className="field-helper field-helper--error">{errors.nom}</span>}
              </div>
              <div className={fieldClass('email')}>
                <label htmlFor="client-email">Email</label>
                <input id="client-email" type="email" name="email" value={form.email} onChange={handleChange} />
                {errors.email && <span className="field-helper field-helper--error">{errors.email}</span>}
              </div>
              <div className={fieldClass('telephone')}>
                <label htmlFor="client-telephone">Téléphone</label>
                <input id="client-telephone" name="telephone" value={form.telephone} onChange={handleChange} />
                {errors.telephone && <span className="field-helper field-helper--error">{errors.telephone}</span>}
              </div>
              <div className={fieldClass('ville')}>
                <label htmlFor="client-ville">Ville</label>
                <input id="client-ville" name="ville" value={form.ville} onChange={handleChange} />
                {errors.ville && <span className="field-helper field-helper--error">{errors.ville}</span>}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/clients')}>
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
