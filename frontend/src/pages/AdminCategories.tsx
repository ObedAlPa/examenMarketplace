import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/ui/Navbar'
import categoryService from '../services/categoryService'
import SimpleModal from '../components/ui/SimpleModal'

export default function AdminCategories(){
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => { if (!auth.user) { navigate('/auth/login'); return } if (auth.user.role !== 'admin') { navigate('/') } }, [auth.user, navigate])

  useEffect(() => { load() }, [])

  const load = async () => { setLoading(true); const c = await categoryService.fetchCategories(); setCategories(c); setLoading(false) }

  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = async () => {
    if (!name || name.trim().length === 0) { setError('Nombre requerido'); return }
    setError(null)
    const cat = { id: 'CAT-' + Date.now(), nombre: name.trim() }
    await categoryService.createCategory(cat)
    setName('')
    await load()
  }

  const confirmDelete = (id: string) => { setDeleteTarget(id); setShowDeleteModal(true) }
  const doDelete = async () => { if (!deleteTarget) return; await categoryService.deleteCategory(deleteTarget); setShowDeleteModal(false); setDeleteTarget(null); await load() }

  const openEdit = (c: any) => { setEditTarget(c); setEditName(c.nombre || ''); setShowEditModal(true) }
  const doEdit = async () => { if (!editName || editName.trim().length === 0) { setError('Nombre requerido'); return } await categoryService.updateCategory(editTarget.id, { nombre: editName.trim() }); setShowEditModal(false); setEditTarget(null); await load() }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Categorías (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Gestión de categorías (mock). Interfaz mínima: lista y creación rápida. Persistencia local usando categoryService.</p>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <input className="p-2 border border-border rounded w-full" placeholder="Nombre de categoría" value={name} onChange={e=>setName(e.target.value)} />
              {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
            </div>
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
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>openEdit(c)}>Editar</button>
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>confirmDelete(c.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <SimpleModal visible={showDeleteModal} title="Eliminar categoría" onCancel={()=>{ setShowDeleteModal(false); setDeleteTarget(null) }} onConfirm={doDelete} confirmText="Eliminar" cancelText="Cancelar">
            <p>¿Eliminar esta categoría (mock)?</p>
          </SimpleModal>

          <SimpleModal visible={showEditModal} title="Editar categoría" onCancel={()=>{ setShowEditModal(false); setEditTarget(null) }} onConfirm={doEdit} confirmText="Guardar" cancelText="Cancelar">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input className="p-2 border border-border rounded w-full" value={editName} onChange={e=>setEditName(e.target.value)} />
            </div>
          </SimpleModal>
        </div>
      </main>
    </div>
  )
}
