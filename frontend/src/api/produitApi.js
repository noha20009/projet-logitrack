import api from './axios'

export const getProduits = (params = {}) => api.get('/products', { params }).then((res) => res.data)

export const getByCategorie = (categorie, params = {}) =>
  api.get(`/products/category/${encodeURIComponent(categorie)}`, { params }).then((res) => res.data)

export const getByPrix = (prix, params = {}) =>
  api.get(`/products/price/${encodeURIComponent(prix)}`, { params }).then((res) => res.data)

export const getLowStock = (params = {}) => api.get('/products/low-stock', { params }).then((res) => res.data)

export const getProduit = (id) => api.get(`/products/${id}`).then((res) => res.data)

export const createProduit = (data) => api.post('/products', data).then((res) => res.data)

export const updateProduit = (id, data) => api.put(`/products/${id}`, data).then((res) => res.data)

export const deleteProduit = (id) => api.delete(`/products/${id}`)
