import * as mockApi from './mockApi'
import { products } from '../mocks/products'

// Product service abstraction. Replace internals with HTTP requests when backend is ready.

export const getFeaturedProducts = async () => {
  // simulate async call
  await new Promise(res => setTimeout(res, 80))
  return mockApi.getFeaturedProducts()
}

export const getCategories = async () => {
  await new Promise(res => setTimeout(res, 40))
  return mockApi.getCategories()
}

export const getProductById = async (id: string | undefined) => {
  await new Promise(res => setTimeout(res, 80))
  return products.find(p => p.id === id) || null
}

export const searchProducts = async (query: string) => {
  await new Promise(res => setTimeout(res, 120))
  const q = query.toLowerCase()
  return products.filter(p => p.titulo.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q))
}

export default {
  getFeaturedProducts,
  getCategories,
  getProductById,
  searchProducts,
}
