// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import userService from './userService'

beforeEach(() => {
  localStorage.clear()
})

describe('userService (mock localStorage)', () => {
  it('returns default users when none in storage', async () => {
    const users = await userService.fetchUsers()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThan(0)
  })

  it('can create, read, update and delete a user', async () => {
    const u = { id: 'USR-test', nombre: 'Test User', email: 'test@example.com', role: 'buyer', created_at: new Date().toISOString() }
    await userService.createUser(u)

    let users = await userService.fetchUsers()
    const found = users.find((x:any) => x.id === 'USR-test')
    expect(found).toBeTruthy()
    expect(found.email).toBe('test@example.com')

    await userService.updateUser('USR-test', { nombre: 'Updated Name' })
    const updated = await userService.getUserById('USR-test')
    expect(updated).toBeTruthy()
    expect(updated.nombre).toBe('Updated Name')

    await userService.deleteUser('USR-test')
    users = await userService.fetchUsers()
    expect(users.find((x:any) => x.id === 'USR-test')).toBeFalsy()
  })

  it('getUserById returns null for missing user', async () => {
    const u = await userService.getUserById('non-existent')
    expect(u).toBeNull()
  })
})
