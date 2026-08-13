// orderService: abstraction for orders. Uses localStorage as mock persistence now (falls back to API when VITE_API_URL is set).

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
    const res = await fetch(`${API_BASE}/api/orders`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getOrderById = async (id: string) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/orders/${id}`)
    if (!res.ok) return null
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  return list.find((o:any) => o.id === id) || null
}

export const createOrder = async (order: Order) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
    if (!res.ok) throw new Error('Failed to create order')
    return res.json()
  }

  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.push(order)
  writeAll(list)
  return order
}

export const updateOrder = async (id: string, patch: any) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) return null
    return res.json()
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
    const res = await fetch(`${API_BASE}/api/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete order')
    return true
  }

  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter((o:any) => o.id !== id)
  writeAll(list)
  return true
}

export default { fetchOrders, getOrderById, createOrder, updateOrder, deleteOrder }
