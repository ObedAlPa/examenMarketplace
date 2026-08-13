// userService: local mock for users (localStorage-backed)

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
  await new Promise(res => setTimeout(res, 60))
  return readAll()
}

export const getUserById = async (id: string) => {
  await new Promise(res => setTimeout(res, 60))
  return readAll().find(u => u.id === id) || null
}

export const createUser = async (user: any) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  list.unshift(user)
  writeAll(list)
  return user
}

export const updateUser = async (id: string, patch: any) => {
  await new Promise(res => setTimeout(res, 80))
  const list = readAll()
  const idx = list.findIndex(u => u.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...patch }
  writeAll(list)
  return list[idx]
}

export const deleteUser = async (id: string) => {
  await new Promise(res => setTimeout(res, 80))
  let list = readAll()
  list = list.filter(u => u.id !== id)
  writeAll(list)
  return true
}

export default { fetchUsers, getUserById, createUser, updateUser, deleteUser }
