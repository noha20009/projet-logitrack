import api from './axios'

export const getStats = () => api.get('/stats').then((res) => res.data)
