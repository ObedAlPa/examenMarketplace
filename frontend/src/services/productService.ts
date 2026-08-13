import * as mockApi from './mockApi'
import { products as defaultProducts } from '../mocks/products'

// Product service abstraction. When VITE_API_URL is set, methods will call the backend API
const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_products'

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading products from localStorage', e)
  }
  return [...defaultProducts]
}

const writeAll = (list: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Error writing products to localStorage', e)
  }
}

export const fetchAllProducts = async () => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products`)
    if (!res.ok) throw new Error('Failed to fetch products from API')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getFeaturedProducts = async () => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products?featured=true`)
    if (!res.ok) throw new Error('Failed to fetch featured products')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll().slice(0, 12)
}

export const getCategories = async () => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/categories`)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 40))
  return mockApi.getCategories()
}

export const getProductById = async (id: string | undefined) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products/${id}`)
    if (!res.ok) return null
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll().find(p => p.id === id) || null
}

export const searchProducts = async (query: string) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products/search?q=` + encodeURIComponent(query))
    if (!res.ok) throw new Error('Search failed')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 120))
  const q = query.toLowerCase()
  return readAll().filter(p => p.titulo.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q))
}

export const createProduct = async (product: any) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
    if (!res.ok) throw new Error('Failed to create product')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.unshift(product)
  writeAll(list)
  return product
}

export const updateProduct = async (id: string, patch: any) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) return null
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(p => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteProduct = async (id: string) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete product')
    return true
  }

  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter(p => p.id !== id)
  writeAll(list)
  return true
}

export default {
  fetchAllProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
