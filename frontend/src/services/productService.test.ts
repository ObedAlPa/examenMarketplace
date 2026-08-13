// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import productService from './productService'

beforeEach(() => { localStorage.clear() })

describe('productService (mock localStorage / API fallback)', () => {
  it('fetchAllProducts returns array (fallback to default mocks)', async () => {
    const list = await productService.fetchAllProducts()
    expect(Array.isArray(list)).toBe(true)
  })

  it('can create, read, update and delete a product locally', async () => {
    const p = { id: 'PRD-test', titulo: 'Test', precio: 9.99, categoria: 'TestCat' }
    await productService.createProduct(p)

    let all = await productService.fetchAllProducts()
    expect(all.find((x:any) => x.id === 'PRD-test')).toBeTruthy()

    await productService.updateProduct('PRD-test', { titulo: 'Updated' })
    const updated = await productService.getProductById('PRD-test')
    expect(updated).toBeTruthy()
    expect(updated.titulo).toBe('Updated')

    await productService.deleteProduct('PRD-test')
    all = await productService.fetchAllProducts()
    expect(all.find((x:any) => x.id === 'PRD-test')).toBeFalsy()
  })

  it('searchProducts respects query', async () => {
    const p = { id: 'PRD-srch', titulo: 'UniqueTitleForSearch', precio: 1 }
    await productService.createProduct(p)
    const res = await productService.searchProducts('UniqueTitle')
    expect(res.length).toBeGreaterThan(0)
    expect(res[0].titulo).toContain('UniqueTitle')
  })
})
