import React, { createContext, useContext, useEffect, useState } from 'react'
import * as cartService from '../services/cartService'

type CartItem = {
  id: string
  titulo: string
  precio: number
  cantidad: number
  archivo_url?: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const API_BASE = import.meta.env.VITE_API_URL || ''

const getToken = () => {
  try { return localStorage.getItem('tenomerca_token') } catch { return null }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('tenomerca_cart')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('tenomerca_cart', JSON.stringify(items))
  }, [items])

  // When the API is available and the user is authenticated, the server cart wins on mount.
  useEffect(() => {
    if (!API_BASE || !getToken()) return
    let mounted = true
    cartService.fetchCart()
      .then(serverItems => { if (mounted) setItems(serverItems) })
      .catch(err => console.error('Error al sincronizar el carrito con el servidor', err))
    return () => { mounted = false }
  }, [])

  const addItem = (item: Omit<CartItem, 'cantidad'>, cantidad = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, cantidad: p.cantidad + cantidad } : p)
      return [...prev, { ...item, cantidad }]
    })
    if (API_BASE) {
      cartService.addItem(item.id, cantidad).catch(err => console.error('Error al agregar al carrito', err))
    }
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
    if (API_BASE) {
      cartService.removeItem(id).catch(err => console.error('Error al eliminar del carrito', err))
    }
  }

  const updateQuantity = (id: string, cantidad: number) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, cantidad } : p))
    if (API_BASE) {
      cartService.updateQuantity(id, cantidad).catch(err => console.error('Error al actualizar la cantidad', err))
    }
  }

  const clear = () => {
    setItems([])
    if (API_BASE) {
      cartService.clearCart().catch(err => console.error('Error al vaciar el carrito', err))
    }
  }

  const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0)
  const count = items.reduce((s, it) => s + it.cantidad, 0)

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, count }}>{children}</CartContext.Provider>
}
