import { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createClient, getClient, updateClient } from '../../api/clientApi'
import Loader from '../../components/Loader'
import { clientSchema } from '../../utils/validation'
import './ClientForm.css'

export default function ClientForm() {
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
    resolver: yupResolver(clientSchema),
    defaultValues: {
      nom: '',
      email: '',
      telephone: '',
      ville: '',
    },
  })

  useEffect(() => {
    if (!isEdit) return
    getClient(id)
      .then((client) => {
        reset({
          nom: client.nom,
          email: client.email,
          telephone: client.telephone || '',
          ville: client.ville || '',
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const onSubmit = async (values) => {
    setError(null)
    try {
      if (isEdit) {
        const updated = await updateClient(id, values)
        navigate(`/clients/${updated.id}`, { replace: true })
      } else {
        const created = await createClient(values)
        navigate(`/clients/${created.id}`, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader />

  const fieldClass = (name) => `field${errors[name] ? ' field--error' : ''}`

  return (
    <div className="form-page">
      <button type="button" className="btn btn--ghost form-back-button" onClick={() => navigate('/clients')}>
        <HiArrowLeft size={18} /> Retour aux clients
      </button>
      <h1 className="page-title">{isEdit ? 'Modifier le client' : 'Nouveau client'}</h1>

      <div className="ui-card">
        <div className="ui-card--pad form-card-content">
          {error && <div className="alert alert--error form-error">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-fields">
              <div className={fieldClass('nom')}>
                <label htmlFor="client-nom">Nom</label>
                <input id="client-nom" {...register('nom')} />
                {errors.nom && <span className="field-helper field-helper--error">{errors.nom.message}</span>}
              </div>
              <div className={fieldClass('email')}>
                <label htmlFor="client-email">Email</label>
                <input id="client-email" type="email" {...register('email')} />
                {errors.email && <span className="field-helper field-helper--error">{errors.email.message}</span>}
              </div>
              <div className={fieldClass('telephone')}>
                <label htmlFor="client-telephone">Téléphone</label>
                <input id="client-telephone" {...register('telephone')} />
                {errors.telephone && (
                  <span className="field-helper field-helper--error">{errors.telephone.message}</span>
                )}
              </div>
              <div className={fieldClass('ville')}>
                <label htmlFor="client-ville">Ville</label>
                <input id="client-ville" {...register('ville')} />
                {errors.ville && <span className="field-helper field-helper--error">{errors.ville.message}</span>}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/clients')}>
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
