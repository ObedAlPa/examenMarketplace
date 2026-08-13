import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

// Mock postal code lookup - in production this will call a postal code API (SEPOMEX or similar)
const mockCpLookup = async (cp: string) => {
  // Simulate network latency
  await new Promise(res => setTimeout(res, 400))
  const map: Record<string, { estado: string; municipio: string; colonias: string[] }> = {
    '01000': { estado: 'Ciudad de México', municipio: 'Cuauhtémoc', colonias: ['Centro', 'San Rafael', 'Juárez'] },
    '64000': { estado: 'Nuevo León', municipio: 'Monterrey', colonias: ['Centro', 'Obispado'] },
    '44100': { estado: 'Jalisco', municipio: 'Guadalajara', colonias: ['Centro', 'Americana'] }
  }
  return map[cp] || null
}

export default function Checkout(){
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [calle, setCalle] = useState('')
  const [numero, setNumero] = useState('')
  const [colonia, setColonia] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [estado, setEstado] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [pais] = useState('México')
  const [telefono, setTelefono] = useState('')

  const [cpLookupResult, setCpLookupResult] = useState<string[] | null>(null)
  const [cpError, setCpError] = useState<string | null>(null)
  const [loadingCp, setLoadingCp] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState('Tarjeta simulada')
  const [submitting, setSubmitting] = useState(false)

  // Debounce CP lookup
  useEffect(() => {
    if (!codigoPostal || codigoPostal.length < 5) { setCpLookupResult(null); setCpError(null); return }
    setLoadingCp(true)
    const t = setTimeout(() => {
      mockCpLookup(codigoPostal).then(res => {
        setLoadingCp(false)
        if (!res) { setCpLookupResult(null); setCpError('Código postal no encontrado (mock).') }
        else {
          setCpLookupResult(res.colonias)
          setMunicipio(res.municipio)
          setEstado(res.estado)
          setCpError(null)
        }
      }).catch(() => { setLoadingCp(false); setCpError('Error en búsqueda (mock).') })
    }, 500)
    return () => clearTimeout(t)
  }, [codigoPostal])

  const handleConfirm = () => {
    // basic validation
    if (!nombre || !calle || !numero || !colonia || !codigoPostal || !telefono) {
      alert('Por favor completa todos los campos de dirección antes de confirmar.')
      return
    }
    setSubmitting(true)
    // create order in localStorage as mock
    const orders = JSON.parse(localStorage.getItem('tenomerca_orders') || '[]')
    const id = 'ORD-' + Date.now()
    const order = {
      id,
      items,
      total,
      direccion: { nombre, calle, numero, colonia, municipio, estado, codigoPostal, pais, telefono },
      paymentMethod,
      paymentStatus: 'Pendiente',
      status: 'Pendiente',
      created_at: new Date().toISOString()
    }
    orders.push(order)
    localStorage.setItem('tenomerca_orders', JSON.stringify(orders))
    // clear cart
    clear()
    setTimeout(() => {
      setSubmitting(false)
      navigate('/orders')
    }, 800)
  }

  const itemCount = useMemo(() => items.reduce((s, it) => s + it.cantidad, 0), [items])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {items.length === 0 ? (
          <div className="bg-white p-6 rounded border border-border">Tu carrito está vacío.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2 bg-white p-4 rounded border border-border">
              <h4 className="font-semibold mb-3">Dirección de envío</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre del destinatario" className="p-2 border border-border rounded" />
                <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Teléfono" className="p-2 border border-border rounded" />
                <input value={codigoPostal} onChange={e=>setCodigoPostal(e.target.value)} placeholder="Código postal" className="p-2 border border-border rounded" />
                <div className="p-2">
                  {loadingCp && <div className="text-sm text-muted">Buscando colonias...</div>}
                  {cpError && <div className="text-sm text-red-600">{cpError}</div>}
                  {cpLookupResult && (
                    <select value={colonia} onChange={e=>setColonia(e.target.value)} className="w-full p-2 border border-border rounded">
                      <option value="">Selecciona colonia</option>
                      {cpLookupResult.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
                <input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="Calle" className="p-2 border border-border rounded" />
                <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Número" className="p-2 border border-border rounded" />
                <input value={municipio} onChange={e=>setMunicipio(e.target.value)} placeholder="Municipio/Delegación" className="p-2 border border-border rounded" />
                <input value={estado} onChange={e=>setEstado(e.target.value)} placeholder="Estado" className="p-2 border border-border rounded" />
              </div>

              <h4 className="font-semibold mt-6 mb-3">Método de pago (simulado)</h4>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><input type="radio" name="pm" checked={paymentMethod==='Tarjeta simulada'} onChange={()=>setPaymentMethod('Tarjeta simulada')} /> Tarjeta simulada</label>
                <label className="flex items-center gap-2"><input type="radio" name="pm" checked={paymentMethod==='Transferencia simulada'} onChange={()=>setPaymentMethod('Transferencia simulada')} /> Transferencia simulada</label>
                <label className="flex items-center gap-2"><input type="radio" name="pm" checked={paymentMethod==='Efectivo/OXXO simulada'} onChange={()=>setPaymentMethod('Efectivo/OXXO simulada')} /> Efectivo / OXXO (simulado)</label>
              </div>

            </section>

            <aside className="md:col-span-1 bg-white p-4 rounded border border-border">
              <h4 className="font-semibold">Resumen ({itemCount} artículos)</h4>
              <div className="mt-4 space-y-3">
                {items.map(it => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div className="text-sm">{it.titulo} x{it.cantidad}</div>
                    <div className="text-sm font-semibold">${(it.precio*it.cantidad).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <div className="flex justify-between"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
                <button disabled={submitting} onClick={handleConfirm} className="mt-4 w-full bg-primary text-white px-4 py-2 rounded">{submitting? 'Procesando...':'Confirmar pedido (simulado)'}</button>
              </div>
            </aside>
          </div>
        )}

      </main>
    </div>
  )
}
