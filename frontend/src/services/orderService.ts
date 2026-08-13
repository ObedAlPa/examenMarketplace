// orderService: abstraction for orders. Uses localStorage as mock persistence now.

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
  await new Promise(res => setTimeout(res, 80))
  return readAll()
}

export const getOrderById = async (id: string) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  return list.find((o:any) => o.id === id) || null
}

export const createOrder = async (order: Order) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.push(order)
  writeAll(list)
  return order
}

export const updateOrder = async (id: string, patch: any) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex((o:any) => o.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteOrder = async (id: string) => {
  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter((o:any) => o.id !== id)
  writeAll(list)
  return true
}

export default { fetchOrders, getOrderById, createOrder, updateOrder, deleteOrder }
