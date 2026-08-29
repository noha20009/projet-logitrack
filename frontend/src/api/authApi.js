import api from './axios'

export const login = (data) => api.post('/auth/login', data).then((res) => res.data)

export const register = (data) => api.post('/auth/register', data).then((res) => res.data)

export const logout = () => api.post('/auth/logout')

export const forgotPassword = (data) => api.post('/auth/forgot-password', data).then((res) => res.data)

export const resetPassword = (data) => api.post('/auth/reset-password', data).then((res) => res.data)
