import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { email: string; nombre?: string; role?: string }

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('tenomerca_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem('tenomerca_user', JSON.stringify(user))
    else localStorage.removeItem('tenomerca_user')
  }, [user])

  const login = async (email: string, password: string) => {
    // Mock authentication using seeded test accounts from README
    // Admin: admin@tenomerca.test / AdminPass123!
    // Buyer: buyer@tenomerca.test / BuyerPass123!
    if (email === 'admin@tenomerca.test' && password === 'AdminPass123!') {
      const u = { email, nombre: 'Administrador Teno', role: 'admin' }
      setUser(u)
      return { ok: true }
    }
    if (email === 'buyer@tenomerca.test' && password === 'BuyerPass123!') {
      const u = { email, nombre: 'Comprador Prueba', role: 'comprador' }
      setUser(u)
      return { ok: true }
    }
    return { ok: false, message: 'Credenciales inválidas (modo mock). Usa los usuarios de prueba en README.' }
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
