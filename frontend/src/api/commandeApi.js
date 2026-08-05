import api from './axios'

export const getCommandes = (params = {}) => api.get('/orders', { params }).then((res) => res.data)

export const getCommandesByClient = (clientId, params = {}) =>
  api.get(`/orders/client/${clientId}`, { params }).then((res) => res.data)

export const getCommande = (id) => api.get(`/orders/${id}`).then((res) => res.data)

export const createCommande = (clientId) => api.post('/orders', null, { params: { clientId } }).then((res) => res.data)

export const addProduitToCommande = (orderId, produitId, quantite) =>
  api
    .post(`/orders/${orderId}/products`, null, { params: { produitId, quantite } })
    .then((res) => res.data)

export const updateStatut = (id, status) =>
  api.put(`/orders/${id}/status`, null, { params: { status } }).then((res) => res.data)

export const deleteCommande = (id) => api.delete(`/orders/${id}`)
