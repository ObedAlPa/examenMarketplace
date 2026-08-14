import * as mockApi from './mockApi'
import apiClient from './apiClient'

const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_categories'

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading categories from localStorage', e)
  }
  // fallback to mockApi
  try {
    const def = mockApi.getCategories()
    if (Array.isArray(def)) return def
  } catch (e) {
    // ignore
  }
  return []
}

const writeAll = (list: any[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch (e) { console.error('Error writing categories', e) }
}

export const fetchCategories = async () => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/categories')
  }
  await new Promise(res => setTimeout(res, 60))
  return readAll()
}

export const createCategory = async (cat: any) => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/categories', { method: 'POST', body: JSON.stringify(cat) })
  }
  await new Promise(res => setTimeout(res, 60))
  const list = readAll()
  list.unshift(cat)
  writeAll(list)
  return cat
}

export const updateCategory = async (id: string, patch: any) => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }
  await new Promise(res => setTimeout(res, 60))
  const list = readAll()
  const idx = list.findIndex((c:any) => c.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteCategory = async (id: string) => {
  if (API_BASE) {
    await apiClient.apiFetch(`/api/categories/${id}`, { method: 'DELETE' })
    return true
  }
  await new Promise(res => setTimeout(res, 60))
  let list = readAll()
  list = list.filter((c:any) => c.id !== id)
  writeAll(list)
  return true
}

export default { fetchCategories, createCategory, updateCategory, deleteCategory }
