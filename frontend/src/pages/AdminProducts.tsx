import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import productService from '../services/productService'

export default function AdminProducts(){
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    productService.getFeaturedProducts().then(list => { if (mounted) setProducts(list) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Productos (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Vista mock para crear/editar/eliminar productos. Implementación mínima (lista + botones) — la persistencia está en productService y se debe sustituir por API cuando exista backend.</p>

          <div className="mb-4">
            <button className="px-3 py-2 bg-primary text-white rounded">Crear producto (mock)</button>
          </div>

          <div className="space-y-2">
            {products.length === 0 ? <div className="text-sm text-muted">No hay productos mock.</div> : products.map(p => (
              <div key={p.id} className="flex justify-between items-center p-2 border border-border rounded">
                <div>
                  <div className="font-semibold">{p.titulo}</div>
                  <div className="text-sm text-muted">{p.categoria || 'Sin categoría'} — ${p.precio?.toFixed?.(2) ?? p.precio}</div>
                </div>
                <div className="space-x-2">
                  <button className="px-2 py-1 border border-border rounded text-sm">Editar</button>
                  <button className="px-2 py-1 border border-border rounded text-sm">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
