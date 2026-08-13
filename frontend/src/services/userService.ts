// userService: local mock for users (localStorage-backed). When VITE_API_URL is set, calls the API.

const API_BASE = import.meta.env.VITE_API_URL || ''
const STORAGE_KEY = 'tenomerca_users'

const defaultUsers = [
  { id: 'USR-1', nombre: 'Admin', email: 'admin@tenomerca.test', role: 'admin', created_at: new Date().toISOString() },
  { id: 'USR-2', nombre: 'Comprador', email: 'buyer@tenomerca.test', role: 'buyer', created_at: new Date().toISOString() },
]

const readAll = (): any[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading users from localStorage', e)
  }
  return [...defaultUsers]
}

const writeAll = (list: any[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch (e) { console.error('Error writing users', e) }
}

export const fetchUsers = async () => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  }
  await new Promise(res => setTimeout(res, 60))
  return readAll()
}

export const getUserById = async (id: string) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/users/${id}`)
    if (!res.ok) return null
    return res.json()
  }
  await new Promise(res => setTimeout(res, 60))
  return readAll().find(u => u.id === id) || null
}

export const createUser = async (user: any) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) })
    if (!res.ok) throw new Error('Failed to create user')
    return res.json()
  }
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.unshift(user)
  writeAll(list)
  return user
}

export const updateUser = async (id: string, patch: any) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) return null
    return res.json()
  }
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(u => u.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteUser = async (id: string) => {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete user')
    return true
  }
  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter(u => u.id !== id)
  writeAll(list)
  return true
}

export default { fetchUsers, getUserById, createUser, updateUser, deleteUser }
