// orderService: abstraction for orders. Uses localStorage as mock persistence now (falls back to API when VITE_API_URL is set).

import apiClient from './apiClient'

const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_orders'

export type Order = any

const readAll = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Error reading orders', e)
    return []
  }
}

const writeAll = (list: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const fetchOrders = async () => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/orders')
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getOrderById = async (id: string) => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/orders/${id}`)
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  return list.find((o:any) => o.id === id) || null
}

export const createOrder = async (order: Order) => {
  if (API_BASE) {
    return apiClient.apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.push(order)
  writeAll(list)
  return order
}

export const updateOrder = async (id: string, patch: any) => {
  if (API_BASE) {
    try {
      return await apiClient.apiFetch(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(patch) })
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex((o:any) => o.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteOrder = async (id: string) => {
  if (API_BASE) {
    await apiClient.apiFetch(`/api/orders/${id}`, { method: 'DELETE' })
    return true
  }

  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter((o:any) => o.id !== id)
  writeAll(list)
  return true
}

export default { fetchOrders, getOrderById, createOrder, updateOrder, deleteOrder }
