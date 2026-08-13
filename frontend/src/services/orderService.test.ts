// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import orderService from './orderService'

beforeEach(() => { localStorage.clear() })

describe('orderService (mock localStorage / API fallback)', () => {
  it('fetchOrders returns array', async () => {
    const list = await orderService.fetchOrders()
    expect(Array.isArray(list)).toBe(true)
  })

  it('can create, read, update and delete an order locally', async () => {
    const o = { id: 'ORD-test', items: [{ id: 'PRD-1', titulo: 'A', precio: 5, cantidad: 1 }], total: 5, direccion: { nombre: 'X' }, paymentMethod: 'mock', paymentStatus: 'Pendiente', status: 'Pendiente', created_at: new Date().toISOString() }
    await orderService.createOrder(o)

    let all = await orderService.fetchOrders()
    expect(all.find((x:any) => x.id === 'ORD-test')).toBeTruthy()

    await orderService.updateOrder('ORD-test', { status: 'Enviado' })
    const updated = await orderService.getOrderById('ORD-test')
    expect(updated).toBeTruthy()
    expect(updated.status).toBe('Enviado')

    await orderService.deleteOrder('ORD-test')
    all = await orderService.fetchOrders()
    expect(all.find((x:any) => x.id === 'ORD-test')).toBeFalsy()
  })
})
