import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/ui/Navbar'
import productService from '../services/productService'
import { v4 as uuidv4 } from 'uuid'
import SimpleModal from '../components/ui/SimpleModal'

export default function AdminProducts(){
  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.user) {
      navigate('/auth/login')
      return
    }
    if (auth.user.role !== 'admin') {
      navigate('/')
    }
  }, [auth.user, navigate])

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // create form state
  const [titulo, setTitulo] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [errors, setErrors] = useState<{titulo?: string; precio?: string}>({})

  useEffect(() => {
    load()
    loadCategories()
  }, [])

  const load = async () => {
    setLoading(true)
    const list = await productService.fetchAllProducts()
    setProducts(list)
    setLoading(false)
  }

  const loadCategories = async () => {
    const list = await productService.getCategories()
    setCategories(list)
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  const handleCreate = async () => {
    if (uploading) return
    const nextErr: any = {}
    if (!titulo || titulo.trim().length < 1) nextErr.titulo = 'Título requerido'
    const precioNum = Number(precio)
    if (!precio || isNaN(precioNum) || precioNum <= 0) nextErr.precio = 'Precio debe ser mayor a 0'
    setErrors(nextErr)
    if (Object.keys(nextErr).length > 0) return

    setUploading(true)
    setUploadMessage(null)
    // Buscar el ID de categoría por su nombre seleccionado
    const catSel = categories.find(c => c.nombre === categoria) || {}
    const p: any = { 
      id: 'PRD-' + Date.now(), 
      titulo: titulo.trim(), 
      precio: precioNum, 
      categoria_id: catSel.id || catSel.categoria_id || null,
      categoria: catSel.nombre || ''
    }
    if (selectedFile) {
      try {
        const res = await productService.uploadImage(selectedFile, catSel.nombre || undefined)
        if (res && res.archivo_url) p.archivo_url = res.archivo_url
      } catch (e: any) {
        if (e && e.status === 503) setUploadMessage('Imagen no subida: Google Drive no configurado. El producto se guardará sin imagen.')
        else setUploadMessage('Imagen no subida. El producto se guardará sin imagen.')
      }
    }
    await productService.createProduct(p)
    setUploading(false)
    setTitulo(''); setPrecio(''); setCategoria(''); setSelectedFile(null)
    await load()
  }

  // delete modal flow
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const confirmDelete = (id: string) => { setDeleteTarget(id); setShowDeleteModal(true) }
  const doDelete = async () => { if (!deleteTarget) return; await productService.deleteProduct(deleteTarget); setShowDeleteModal(false); setDeleteTarget(null); await load() }

  // edit modal flow
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editPrecio, setEditPrecio] = useState('')
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null)
  const [editCategories, setEditCategories] = useState<any[]>([])
  const openEdit = (p: any) => {
    setEditTarget(p)
    setEditTitulo(p.titulo || '')
    setEditPrecio(String(p.precio || '0'))
    // Cargar categorías para el edit modal
    loadCategories().then(() => {
      setEditCategories(categories)
    })
    setEditSelectedFile(null)
    setUploadMessage(null)
    setShowEditModal(true)
  }
  const doEdit = async () => {
    if (uploading) return
    const nextErr: any = {}
    if (!editTitulo || editTitulo.trim().length < 1) nextErr.titulo = 'Título requerido'
    const precioNum = Number(editPrecio)
    if (!editPrecio || isNaN(precioNum) || precioNum <= 0) nextErr.precio = 'Precio debe ser mayor a 0'
    setErrors(nextErr)
    if (Object.keys(nextErr).length > 0) return
    if (!editTarget) return

    setUploading(true)
    setUploadMessage(null)
    const catSel = editCategories.find((c: any) => c.nombre === editCategoria) || {}
    const patch: any = { titulo: editTitulo.trim(), precio: precioNum }
    if (editSelectedFile) {
      try {
        const res = await productService.uploadImage(editSelectedFile, editCategoria)
        if (res && res.archivo_url) patch.archivo_url = res.archivo_url
      } catch (e: any) {
        if (e && e.status === 503) setUploadMessage('Imagen no subida: Google Drive no configurado. El producto se guardará sin imagen.')
        else setUploadMessage('Imagen no subida. El producto se guardará sin imagen.')
      }
    }
    // Asegurarse de incluir categoría en el parche
    patch.categoria_id = catSel.id || editTarget.categoria_id
    patch.categoria = catSel.nombre || editTarget.categoria || ''
    await productService.updateProduct(editTarget.id, patch)
    setUploading(false)
    setShowEditModal(false)
    setEditTarget(null)
    setEditSelectedFile(null)
    await load()
  }

  const handleInlineUpdate = async (id: string, patch: any) => {
    await productService.updateProduct(id, patch)
    await load()
  }

  // Cargar categorías al iniciar
  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Productos (CRUD)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Gestión de productos con persistencia en backend.</p>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <input className="p-2 border border-border rounded w-full" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} />
              {errors.titulo && <div className="text-sm text-red-600 mt-1">{errors.titulo}</div>}
            </div>
            <div>
              <input className="p-2 border border-border rounded w-full" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
              {errors.precio && <div className="text-sm text-red-600 mt-1">{errors.precio}</div>}
            </div>
            <div>
              <label className="block text-sm mb-1">Categoría</label>
              <select
                className="p-2 border border-border rounded w-full"
                value={categoria}
                onChange={e=>setCategoria(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>{categorías.length === 0 ? 'Cargando categorías...' : 'Seleccione una categoría'}</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 flex items-center space-x-4">
            <input type="file" accept="image/*" className="text-sm" onChange={e=>setSelectedFile(e.target.files?.[0] || null)} />
            {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Vista previa" className="w-16 h-16 object-cover rounded border border-border" />}
          </div>
          <div className="mb-6">
            <button className="px-3 py-2 bg-primary text-white rounded disabled:opacity-50" onClick={handleCreate} disabled={uploading || !categoria}>{uploading ? 'Subiendo...' : 'Crear producto'}</button>
            {uploadMessage && <div className="text-sm text-red-600 mt-2">{uploadMessage}</div>}
          </div>

          <div className="space-y-2">
            {loading ? <div className="text-sm text-muted">Cargando...</div> : (
              products.length === 0 ? <div className="text-sm text-muted">No hay productos.</div> : products.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 border border-border rounded">
                  <div className="w-2/3">
                    <div className="font-semibold">{p.titulo}</div>
                    <div className="text-sm text-muted">{p.categoria || 'Sin categoría'} — ${p.precio?.toFixed?.(2) ?? p.precio}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input className="p-1 border border-border rounded text-sm w-40" defaultValue={p.titulo} onBlur={e=>{ if (e.target.value !== p.titulo) handleInlineUpdate(p.id, { titulo: e.target.value }) }} />
                    <input className="p-1 border border-border rounded text-sm w-24" defaultValue={String(p.precio)} onBlur={e=>{ const v = Number(e.target.value) || 0; if (v !== p.precio) handleInlineUpdate(p.id, { precio: v }) }} />
                    <input className="p-1 border border-border rounded text-sm w-32" defaultValue={p.categoria} onBlur={e=>{ if (e.target.value !== p.categoria) handleInlineUpdate(p.id, { categoria: e.target.value }) }} />
                    <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>openEdit(p)}>Editar</button>
                    <button className="px-2 py-1 border border-border rounded text-sm" onClick={()=>confirmDelete(p.id)}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        {/** import SimpleModal dynamically to avoid circularity issues */}
      </main>

      <SimpleModal visible={showDeleteModal} title="Eliminar producto" onCancel={()=>{ setShowDeleteModal(false); setDeleteTarget(null) }} onConfirm={doDelete} confirmText="Eliminar" cancelText="Cancelar">
        <p>¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.</p>
      </SimpleModal>

      <SimpleModal visible={showEditModal} title="Editar producto" onCancel={()=>{ setShowEditModal(false); setEditTarget(null) }} onConfirm={doEdit} confirmText={uploading ? 'Subiendo...' : 'Guardar'} cancelText="Cancelar">
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm mb-1">Título</label>
            <input className="p-2 border border-border rounded w-full" value={editTitulo} onChange={e=>setEditTitulo(e.target.value)} />
            {errors.titulo && <div className="text-sm text-red-600 mt-1">{errors.titulo}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <input className="p-2 border border-border rounded w-full" value={editPrecio} onChange={e=>setEditPrecio(e.target.value)} />
            {errors.precio && <div className="text-sm text-red-600 mt-1">{errors.precio}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <select
              className="p-2 border border-border rounded w-full"
              value={editCategoria}
              onChange={e=>setEditCategoria(e.target.value)}
              disabled={loading}
            >
              <option value="" disabled>{categorías.length === 0 ? 'Cargando categorías...' : 'Seleccione una categoría'}</option>
              {editCategories.map((c: any) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Imagen</label>
            <input type="file" accept="image/*" className="text-sm" onChange={e=>setEditSelectedFile(e.target.files?.[0] || null)} />
            <div className="mt-2">
              {editSelectedFile
                ? <img src={URL.createObjectURL(editSelectedFile)} alt="Vista previa" className="w-16 h-16 object-cover rounded border border-border" />
                : editTarget?.archivo_url && <img src={editTarget.archivo_url} alt="Imagen del producto" className="w-16 h-16 object-cover rounded border border-border" />}
            </div>
            {uploadMessage && <div className="text-sm text-red-600 mt-2">{uploadMessage}</div>}
          </div>
        </div>
      </SimpleModal>

      </div>
  )
}