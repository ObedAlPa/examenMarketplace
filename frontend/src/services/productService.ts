import * as mockApi from './mockApi'
import { products as defaultProducts } from '../mocks/products'
import apiClient from './apiClient'

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
    return apiClient.apiFetch('/api/products')
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getFeaturedProducts = async () => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/products?featured=true')
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll().slice(0, 12)
}

export const getCategories = async () => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/categories')
  }

  await new Promise(res => setTimeout(res, 40))
  return mockApi.getCategories()
}

export const getProductById = async (id: string | undefined) => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/products/${id}`)
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll().find(p => p.id === id) || null
}

export const searchProducts = async (query: string) => {
  if (API_BASE) {
    return apiClient.apiFetch(`/api/products/search?q=${encodeURIComponent(query)}`)
  }

  await new Promise(res => setTimeout(res, 120))
  const q = query.toLowerCase()
  return readAll().filter(p => p.titulo.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q))
}

export const createProduct = async (product: any) => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/products', { method: 'POST', body: JSON.stringify(product) })
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.unshift(product)
  writeAll(list)
  return product
}

export const updateProduct = async (id: string, patch: any) => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(p => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const uploadImage = async (file: File) => {
  if (API_BASE) {
    const formData = new FormData()
    formData.append('image', file)
    return apiClient.apiFetch('/api/upload', { method: 'POST', body: formData })
  }

  await new Promise(res => setTimeout(res, 80))
  return { archivo_url: '/placeholder.svg' }
}

export const deleteProduct = async (id: string) => {
  if (API_BASE) {
    await apiClient.apiFetch(`/api/products/${id}`, { method: 'DELETE' })
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
  uploadImage,
}
