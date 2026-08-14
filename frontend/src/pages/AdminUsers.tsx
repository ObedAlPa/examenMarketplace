import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/ui/Navbar'
import userService from '../services/userService'
import SimpleModal from '../components/ui/SimpleModal'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AdminUsers(){
  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => { if (!auth.user) { navigate('/auth/login'); return } if (auth.user.role !== 'admin') { navigate('/') } }, [auth.user, navigate])

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState<string | null>(null)

  // edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('buyer')
  const [editError, setEditError] = useState<string | null>(null)

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => { setLoading(true); const list = await userService.fetchUsers(); setUsers(list); setLoading(false) }

  const validateCreate = () => {
    if (!nombre || nombre.trim().length < 2) { setError('Nombre requerido (mínimo 2 caracteres)'); return false }
    if (!email || !emailRegex.test(email)) { setError('Email inválido') ; return false }
    setError(null)
    return true
  }

  const handleCreate = async () => {
    if (!validateCreate()) return
    const u = { id: 'USR-' + Date.now(), nombre: nombre.trim(), email: email.trim(), role, created_at: new Date().toISOString() }
    await userService.createUser(u)
    setNombre(''); setEmail(''); setRole('buyer')
    await load()
  }

  const openEdit = (u: any) => { setEditTarget(u); setEditNombre(u.nombre || ''); setEditEmail(u.email || ''); setEditRole(u.role || 'buyer'); setEditError(null); setShowEditModal(true) }

  const doEdit = async () => {
    if (!editNombre || editNombre.trim().length < 2) { setEditError('Nombre requerido (mínimo 2 caracteres)'); return }
    if (!editEmail || !emailRegex.test(editEmail)) { setEditError('Email inválido'); return }
    if (!editTarget) return
    await userService.updateUser(editTarget.id, { nombre: editNombre.trim(), email: editEmail.trim(), role: editRole })
    setShowEditModal(false); setEditTarget(null)
    await load()
  }

  const confirmDelete = (id: string) => { setDeleteTarget(id); setShowDeleteModal(true) }
  const doDelete = async () => { if (!deleteTarget) return; await userService.deleteUser(deleteTarget); setShowDeleteModal(false); setDeleteTarget(null); await load() }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Usuarios (CRUD mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Gestión de usuarios (mock). Crear, editar y eliminar usuarios localmente. Reemplazar por API cuando exista backend.</p>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <input className="p-2 border border-border rounded w-full" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
            </div>
            <div>
              <input className="p-2 border border-border rounded w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <select className="p-2 border border-border rounded w-full" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <button className="px-3 py-2 bg-primary text-white rounded w-full" onClick={handleCreate}>Crear usuario (mock)</button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <div className="space-y-2">
            {loading ? <div className="text-sm text-muted">Cargando...</div> : users.length === 0 ? <div className="text-sm text-muted">No hay usuarios.</div> : users.map(u => (
              <div key={u.id} className="flex justify-between items-center p-2 border border-border rounded">
                <div>
                  <div className="font-semibold">{u.nombre} <span className="text-sm text-muted">({u.role})</span></div>
                  <div className="text-sm text-muted">{u.email}</div>
                </div>
                <div className="space-x-2">
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>openEdit(u)}>Editar</button>
                  <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>confirmDelete(u.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <SimpleModal visible={showEditModal} title="Editar usuario" onCancel={()=>{ setShowEditModal(false); setEditTarget(null) }} onConfirm={doEdit} confirmText="Guardar" cancelText="Cancelar">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input className="p-2 border border-border rounded w-full" value={editNombre} onChange={e=>setEditNombre(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="p-2 border border-border rounded w-full" value={editEmail} onChange={e=>setEditEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Rol</label>
                <select className="p-2 border border-border rounded w-full" value={editRole} onChange={e=>setEditRole(e.target.value)}>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {editError && <div className="text-sm text-red-600">{editError}</div>}
            </div>
          </SimpleModal>

          <SimpleModal visible={showDeleteModal} title="Eliminar usuario" onCancel={()=>{ setShowDeleteModal(false); setDeleteTarget(null) }} onConfirm={doDelete} confirmText="Eliminar" cancelText="Cancelar">
            <p>¿Eliminar este usuario mock? Esta acción quitará el usuario de la lista local.</p>
          </SimpleModal>
        </div>
      </main>
    </div>
  )
}
