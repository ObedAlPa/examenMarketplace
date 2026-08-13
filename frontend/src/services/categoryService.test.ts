// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import categoryService from './categoryService'

beforeEach(() => { localStorage.clear() })

describe('categoryService (mock localStorage / API fallback)', () => {
  it('fetchCategories returns array (may be empty)', async () => {
    const list = await categoryService.fetchCategories()
    expect(Array.isArray(list)).toBe(true)
  })

  it('can create, update and delete a category locally', async () => {
    const c = { id: 'CAT-test', nombre: 'CatTest' }
    await categoryService.createCategory(c)

    let all = await categoryService.fetchCategories()
    expect(all.find((x:any) => x.id === 'CAT-test')).toBeTruthy()

    await categoryService.updateCategory('CAT-test', { nombre: 'CatUpdated' })
    all = await categoryService.fetchCategories()
    const updated = all.find((x:any) => x.id === 'CAT-test')
    expect(updated.nombre).toBe('CatUpdated')

    await categoryService.deleteCategory('CAT-test')
    all = await categoryService.fetchCategories()
    expect(all.find((x:any) => x.id === 'CAT-test')).toBeFalsy()
  })
})
