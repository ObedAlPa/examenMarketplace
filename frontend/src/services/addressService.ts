// addressService.ts
// Minimal client-side abstraction for addresses. Currently uses localStorage to store addresses
// under the key 'tenomerca_addresses'. When backend is ready, replace implementations with
// HTTP requests to your API (e.g., GET /api/addresses, POST /api/addresses, etc.).

import { v4 as uuidv4 } from 'uuid'

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
  // Placeholder: simulate async API call
  await new Promise(res => setTimeout(res, 100))
  return readAll()
}

export const createAddress = async (data: Omit<Address, 'id'>): Promise<Address> => {
  await new Promise(res => setTimeout(res, 100))
  const list = readAll()
  const newAddr: Address = { id: uuidv4(), ...data }
  list.push(newAddr)
  writeAll(list)
  return newAddr
}

export const updateAddress = async (id: string, data: Partial<Address>): Promise<Address | null> => {
  await new Promise(res => setTimeout(res, 100))
  const list = readAll()
  const idx = list.findIndex(a => a.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...data }
  writeAll(list)
  return list[idx]
}

export const deleteAddress = async (id: string): Promise<boolean> => {
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
