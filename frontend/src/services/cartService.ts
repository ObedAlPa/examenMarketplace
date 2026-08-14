// cartService: abstraction for the shopping cart. Uses localStorage as mock persistence now (falls back to API when VITE_API_URL is set).

import apiClient from './apiClient'

const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_cart'

export type CartItem = {
  id: string
  titulo: string
  precio: number
  cantidad: number
  archivo_url?: string
}

const readAll = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Error reading cart', e)
    return []
  }
}

const writeAll = (list: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const fetchCart = async (): Promise<CartItem[]> => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/cart')
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const addItem = async (productId: string, cantidad = 1): Promise<CartItem> => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, cantidad }) })
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const found = list.find(it => it.id === productId)
  if (found) {
    found.cantidad += cantidad
  } else {
    list.push({ id: productId, titulo: productId, precio: 0, cantidad })
  }
  writeAll(list)
  return found || list[list.length - 1]
}

export const updateQuantity = async (productId: string, cantidad: number): Promise<CartItem> => {
  if (API_BASE) {
    return apiClient.apiFetch(`/api/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ cantidad }) })
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(it => it.id === productId)
  if (idx === -1) return { id: productId, titulo: productId, precio: 0, cantidad }
  list[idx] = { ...list[idx], cantidad }
  writeAll(list)
  return list[idx]
}

export const removeItem = async (productId: string) => {
  if (API_BASE) {
    await apiClient.apiFetch(`/api/cart/items/${productId}`, { method: 'DELETE' })
    return true
  }

  await new Promise(res => setTimeout(res, 80))
  writeAll(readAll().filter(it => it.id !== productId))
  return true
}

export const clearCart = async () => {
  if (API_BASE) {
    await apiClient.apiFetch('/api/cart', { method: 'DELETE' })
    return true
  }

  await new Promise(res => setTimeout(res, 80))
  localStorage.removeItem(STORAGE_KEY)
  return true
}

export default { fetchCart, addItem, updateQuantity, removeItem, clearCart }
