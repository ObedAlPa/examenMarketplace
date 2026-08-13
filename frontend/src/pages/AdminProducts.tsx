import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import productService from '../services/productService'
import { v4 as uuidv4 } from 'uuid'

export default function AdminProducts(){
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // create form state
  const [titulo, setTitulo] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const list = await productService.fetchAllProducts()
    setProducts(list)
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!titulo) return alert('Título requerido')
    const p = { id: 'PRD-' + Date.now(), titulo, precio: Number(precio) || 0, categoria }
    await productService.createProduct(p)
    setTitulo(''); setPrecio(''); setCategoria('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar producto mock?')) return
    await productService.deleteProduct(id)
    await load()
  }

  const handleInlineUpdate = async (id: string, patch: any) => {
    await productService.updateProduct(id, patch)
    await load()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Productos (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Vista mock para crear/editar/eliminar productos. Persistencia local (mock) mediante productService; reemplazar por API en backend.</p>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input className="p-2 border border-border rounded" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} />
            <input className="p-2 border border-border rounded" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
            <input className="p-2 border border-border rounded" placeholder="Categoría" value={categoria} onChange={e=>setCategoria(e.target.value)} />
          </div>
          <div className="mb-6">
            <button className="px-3 py-2 bg-primary text-white rounded" onClick={handleCreate}>Crear producto (mock)</button>
          </div>

          <div className="space-y-2">
            {loading ? <div className="text-sm text-muted">Cargando...</div> : (
              products.length === 0 ? <div className="text-sm text-muted">No hay productos mock.</div> : products.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 border border-border rounded">
                  <div className="w-2/3">
                    <div className="font-semibold">{p.titulo}</div>
                    <div className="text-sm text-muted">{p.categoria || 'Sin categoría'} — ${p.precio?.toFixed?.(2) ?? p.precio}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input className="p-1 border border-border rounded text-sm w-40" defaultValue={p.titulo} onBlur={e=>{ if (e.target.value !== p.titulo) handleInlineUpdate(p.id, { titulo: e.target.value }) }} />
                    <input className="p-1 border border-border rounded text-sm w-24" defaultValue={String(p.precio)} onBlur={e=>{ const v = Number(e.target.value) || 0; if (v !== p.precio) handleInlineUpdate(p.id, { precio: v }) }} />
                    <input className="p-1 border border-border rounded text-sm w-32" defaultValue={p.categoria} onBlur={e=>{ if (e.target.value !== p.categoria) handleInlineUpdate(p.id, { categoria: e.target.value }) }} />
                    <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>{ const newTitle = prompt('Nuevo título', p.titulo); if (newTitle && newTitle !== p.titulo) handleInlineUpdate(p.id, { titulo: newTitle }) }}>Editar</button>
                    <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>handleDelete(p.id)}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
