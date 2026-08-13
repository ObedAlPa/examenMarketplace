import * as mockApi from './mockApi'
import { products as defaultProducts } from '../mocks/products'

// Product service abstraction. Replace internals with HTTP requests when backend is ready.
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
  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getFeaturedProducts = async () => {
  // simulate async call
  await new Promise(res => setTimeout(res, 80))
  // return stored products (fallback to defaults)
  return readAll().slice(0, 12)
}

export const getCategories = async () => {
  await new Promise(res => setTimeout(res, 40))
  return mockApi.getCategories()
}

export const getProductById = async (id: string | undefined) => {
  await new Promise(res => setTimeout(res, 80))
  return readAll().find(p => p.id === id) || null
}

export const searchProducts = async (query: string) => {
  await new Promise(res => setTimeout(res, 120))
  const q = query.toLowerCase()
  return readAll().filter(p => p.titulo.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q))
}

export const createProduct = async (product: any) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.unshift(product)
  writeAll(list)
  return product
}

export const updateProduct = async (id: string, patch: any) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(p => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteProduct = async (id: string) => {
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
