import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import * as addressService from '../services/addressService'

export default function AddressBook(){
  const [addresses, setAddresses] = useState<addressService.Address[]>([])
  const [editing, setEditing] = useState<addressService.Address | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const list = await addressService.fetchAddresses()
    setAddresses(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const startAdd = () => setEditing({ id: '', alias: '', nombre: '', calle: '', numero: '', colonia: '', municipio: '', estado: '', codigoPostal: '', pais: 'México', telefono: '' })
  const startEdit = (a: addressService.Address) => setEditing(a)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const payload = { ...editing }
    // if id is empty, create
    if (!editing.id) {
      await addressService.createAddress(payload as any)
    } else {
      await addressService.updateAddress(editing.id, payload)
    }
    setEditing(null)
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminar dirección?')) return
    await addressService.deleteAddress(id)
    await load()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Direcciones guardadas</h1>
        <p className="text-muted mt-2">Aquí podrás gestionar tus direcciones. Actualmente se usan servicios locales (mock/localStorage); cuando el backend esté disponible, la implementación cambiará a llamadas a la API.</p>

        <div className="mt-4">
          <button onClick={startAdd} className="bg-primary text-white px-3 py-2 rounded">Añadir dirección</button>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? <div>Cargando...</div> : (
            addresses.length === 0 ? <div className="text-muted">No hay direcciones guardadas.</div> : (
              addresses.map(a => (
                <div key={a.id} className="bg-white p-3 rounded border border-border flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{a.alias || a.nombre}</div>
                    <div className="text-sm">{a.calle} {a.numero}, {a.colonia}</div>
                    <div className="text-sm text-muted">{a.municipio}, {a.estado} — {a.codigoPostal}</div>
                    <div className="text-sm">Tel: {a.telefono}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(a)} className="px-2 py-1 border rounded">Editar</button>
                    <button onClick={() => remove(a.id)} className="px-2 py-1 border rounded">Eliminar</button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {editing && (
          <form onSubmit={save} className="mt-6 bg-white p-4 rounded border border-border">
            <h3 className="font-semibold mb-2">{editing.id ? 'Editar dirección' : 'Nueva dirección'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Alias (ej. Casa, Oficina)" value={editing.alias} onChange={e=>setEditing({...editing, alias: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Nombre" value={editing.nombre} onChange={e=>setEditing({...editing, nombre: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Calle" value={editing.calle} onChange={e=>setEditing({...editing, calle: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Número" value={editing.numero} onChange={e=>setEditing({...editing, numero: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Colonia" value={editing.colonia} onChange={e=>setEditing({...editing, colonia: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Código postal" value={editing.codigoPostal} onChange={e=>setEditing({...editing, codigoPostal: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Municipio" value={editing.municipio} onChange={e=>setEditing({...editing, municipio: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Estado" value={editing.estado} onChange={e=>setEditing({...editing, estado: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Teléfono" value={editing.telefono} onChange={e=>setEditing({...editing, telefono: e.target.value})} className="p-2 border rounded" />
            </div>
            <div className="mt-3 flex gap-2">
              <button type="submit" className="px-3 py-2 bg-primary text-white rounded">Guardar</button>
              <button type="button" onClick={()=>setEditing(null)} className="px-3 py-2 border rounded">Cancelar</button>
            </div>
          </form>
        )}

      </main>
    </div>
  )
}
