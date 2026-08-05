import axios from 'axios'

const TOKEN_KEY = 'logitrack_token'
const USER_KEY = 'logitrack_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

const STATUS_MESSAGES = {
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
  404: 'La ressource demandée est introuvable.',
  500: 'Une erreur interne est survenue. Veuillez réessayer.',
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message || STATUS_MESSAGES[status] || 'Erreur réseau. Vérifiez votre connexion.'

    if (status === 401) {
      if (getToken()) {
        clearSession()
        window.location.href = '/login'
      }
    }

    if (status === 403) {
      window.location.href = '/access-denied'
    }

    return Promise.reject(new Error(message))
  }
)

export default api
