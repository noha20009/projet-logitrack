import { createContext, useContext, useMemo, useState } from 'react'
import { clearSession, getStoredUser, getToken, setSession } from '../api/axios'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getToken())

  const isAuthenticated = Boolean(token && user)

  const login = async (credentials) => {
    const data = await authApi.login(credentials)
    setSession(data.token, {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      role: data.role,
    })
    setToken(data.token)
    setUser({ id: data.id, nom: data.nom, prenom: data.prenom, email: data.email, role: data.role })
    return data
  }

  const register = async (payload) => {
    const data = await authApi.register(payload)
    setSession(data.token, {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      role: data.role,
    })
    setToken(data.token)
    setUser({ id: data.id, nom: data.nom, prenom: data.prenom, email: data.email, role: data.role })
    return data
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => {
    const hasRole = (...roles) => user && roles.includes(user.role)
    return {
      user,
      token,
      isAuthenticated,
      role: user?.role || null,
      hasRole,
      login,
      register,
      logout,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>')
  }
  return ctx
}
