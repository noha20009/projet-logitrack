import api from './axios'

export const getClients = (params = {}) => api.get('/clients', { params }).then((res) => res.data)

export const searchClients = (params = {}) => api.get('/clients/search', { params }).then((res) => res.data)

export const getClient = (id) => api.get(`/clients/${id}`).then((res) => res.data)

export const createClient = (data) => api.post('/clients', data).then((res) => res.data)

export const updateClient = (id, data) => api.put(`/clients/${id}`, data).then((res) => res.data)

export const deleteClient = (id) => api.delete(`/clients/${id}`)
