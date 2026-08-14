// addressService.ts
// Minimal client-side abstraction for addresses. Uses localStorage by default; when VITE_API_URL is set
// the service will call the backend API endpoints under /api/addresses.

import { v4 as uuidv4 } from 'uuid'
import apiClient from './apiClient'

const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_addresses'

export type Address = {
  id: string
  alias?: string
  nombre: string
  calle: string
  numero: string
  colonia: string
  municipio?: string
  estado?: string
  codigoPostal: string
  pais?: string
  telefono?: string
}

const readAll = (): Address[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Address[]
  } catch (e) {
    console.error('Error reading addresses from storage', e)
    return []
  }
}

const writeAll = (list: Address[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const fetchAddresses = async (): Promise<Address[]> => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/addresses')
  }
  // Placeholder: simulate async API call
  await new Promise(res => setTimeout(res, 100))
  return readAll()
}

export const createAddress = async (data: Omit<Address, 'id'>): Promise<Address> => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(data) })
  }
  await new Promise(res => setTimeout(res, 100))
  const list = readAll()
  const newAddr: Address = { id: uuidv4(), ...data }
  list.push(newAddr)
  writeAll(list)
  return newAddr
}

export const updateAddress = async (id: string, data: Partial<Address>): Promise<Address | null> => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }
  await new Promise(res => setTimeout(res, 100))
  const list = readAll()
  const idx = list.findIndex(a => a.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...data }
  writeAll(list)
  return list[idx]
}

export const deleteAddress = async (id: string): Promise<boolean> => {
  if (API_BASE) {
    await apiClient.apiFetch(`/api/addresses/${id}`, { method: 'DELETE' })
    return true
  }
  await new Promise(res => setTimeout(res, 100))
  let list = readAll()
  const before = list.length
  list = list.filter(a => a.id !== id)
  writeAll(list)
  return list.length < before
}

export default {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
}
