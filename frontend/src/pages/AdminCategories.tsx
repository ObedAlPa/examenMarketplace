import React from 'react'
import Navbar from '../components/ui/Navbar'

export default function AdminCategories(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Categorías (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Gestión de categorías (mock). interfaz mínima: lista de categorías y botones para crear/editar/eliminar. Persistencia: pendiente (mock/local service).</p>
          <div className="mb-4">
            <button className="px-3 py-2 bg-primary text-white rounded">Crear categoría (mock)</button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border border-border rounded">
              <div>
                <div className="font-semibold">Ropa</div>
                <div className="text-sm text-muted">Productos: 12</div>
              </div>
              <div className="space-x-2">
                <button className="px-2 py-1 border border-border rounded text-sm">Editar</button>
                <button className="px-2 py-1 border border-border rounded text-sm">Eliminar</button>
              </div>
            </div>

            <div className="flex justify-between items-center p-2 border border-border rounded">
              <div>
                <div className="font-semibold">Artesanías</div>
                <div className="text-sm text-muted">Productos: 8</div>
              </div>
              <div className="space-x-2">
                <button className="px-2 py-1 border border-border rounded text-sm">Editar</button>
                <button className="px-2 py-1 border border-border rounded text-sm">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
