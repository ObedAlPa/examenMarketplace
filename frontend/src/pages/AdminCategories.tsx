import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import categoryService from '../services/categoryService'

export default function AdminCategories(){
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => { setLoading(true); const c = await categoryService.fetchCategories(); setCategories(c); setLoading(false) }

  const handleCreate = async () => {
    if (!name) return alert('Nombre requerido')
    const cat = { id: 'CAT-' + Date.now(), nombre: name }
    await categoryService.createCategory(cat)
    setName('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar categoría mock?')) return
    await categoryService.deleteCategory(id)
    await load()
  }

  const handleUpdate = async (id: string) => {
    const nuevo = prompt('Nuevo nombre')
    if (!nuevo) return
    await categoryService.updateCategory(id, { nombre: nuevo })
    await load()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Categorías (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Gestión de categorías (mock). Interfaz mínima: lista y creación rápida. Persistencia local usando categoryService.</p>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input className="p-2 border border-border rounded" placeholder="Nombre de categoría" value={name} onChange={e=>setName(e.target.value)} />
            <div className="sm:col-span-2">
              <button className="px-3 py-2 bg-primary text-white rounded" onClick={handleCreate}>Crear categoría (mock)</button>
            </div>
          </div>

          <div className="space-y-2">
            {loading ? <div className="text-sm text-muted">Cargando...</div> : categories.length === 0 ? <div className="text-sm text-muted">No hay categorías.</div> : categories.map(c => (
              <div key={c.id} className="flex justify-between items-center p-2 border border-border rounded">
                <div>
                  <div className="font-semibold">{c.nombre || c.name || c.id}</div>
                </div>
                <div className="space-x-2">
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>handleUpdate(c.id)}>Editar</button>
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>handleDelete(c.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
