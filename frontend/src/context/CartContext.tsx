import React, { createContext, useContext, useEffect, useState } from 'react'

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

  const addItem = (item: Omit<CartItem, 'cantidad'>, cantidad = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, cantidad: p.cantidad + cantidad } : p)
      return [...prev, { ...item, cantidad }]
    })
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(p => p.id !== id))
  const updateQuantity = (id: string, cantidad: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, cantidad } : p))
  const clear = () => setItems([])

  const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0)
  const count = items.reduce((s, it) => s + it.cantidad, 0)

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, count }}>{children}</CartContext.Provider>
}
