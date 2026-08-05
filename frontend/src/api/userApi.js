import api from './axios'

export const getUsers = () => api.get('/users').then((res) => res.data)

export const getUser = (id) => api.get(`/users/${id}`).then((res) => res.data)

export const createUser = (data) => api.post('/users', data).then((res) => res.data)

export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, null, { params: { role } }).then((res) => res.data)

export const deleteUser = (id) => api.delete(`/users/${id}`)
