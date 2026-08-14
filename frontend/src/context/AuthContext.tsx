import React, { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../services/apiClient'

type User = { email: string; nombre?: string; role?: string }

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  register: (nombre: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>
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

  // If a token exists and no user is set, try to fetch current user from API
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || ''
    const token = (() => { try { return localStorage.getItem('tenomerca_token') } catch { return null } })()
    if (!user && token && API_BASE) {
      apiClient.apiFetch('/api/auth/me')
        .then((payload: any) => {
          if (payload && payload.user) setUser(payload.user)
        })
        .catch(() => {
          try { localStorage.removeItem('tenomerca_token') } catch {}
        })
    }
  }, [user])

  const login = async (email: string, password: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || ''

    if (API_BASE) {
      try {
        const resp: any = await apiClient.apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
        if (resp && resp.token) {
          try { localStorage.setItem('tenomerca_token', resp.token) } catch {}
        }
        if (resp && resp.user) setUser(resp.user)
        return { ok: true }
      } catch (e: any) {
        return { ok: false, message: e && e.message ? e.message : 'Error de autenticación' }
      }
    }

    // Mock authentication using seeded test accounts from README
    // Admin: admin@auto.partes.test / AdminPass123!
    // Buyer: buyer@auto.partes.test / BuyerPass123!
    if (email === 'admin@auto.partes.test' && password === 'AdminPass123!') {
      const u = { email, nombre: 'Administrador Auto', role: 'admin' }
      setUser(u)
      return { ok: true }
    }
    if (email === 'buyer@auto.partes.test' && password === 'BuyerPass123!') {
      const u = { email, nombre: 'Comprador Prueba', role: 'comprador' }
      setUser(u)
      return { ok: true }
    }
    return { ok: false, message: 'Credenciales inválidas (modo mock). Usa los usuarios de prueba en README.' }
  }

  const register = async (nombre: string, email: string, password: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || ''

    if (API_BASE) {
      try {
        const resp: any = await apiClient.apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ nombre, email, password }) })
        if (resp && resp.token) {
          try { localStorage.setItem('tenomerca_token', resp.token) } catch {}
        }
        if (resp && resp.user) setUser(resp.user)
        return { ok: true }
      } catch (e: any) {
        return { ok: false, message: e && e.message ? e.message : 'Error al crear la cuenta' }
      }
    }

    return { ok: true }
  }

  const logout = () => {
    try { localStorage.removeItem('tenomerca_token') } catch {}
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}
