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

  // validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [cpLookupResult, setCpLookupResult] = useState<string[] | null>(null)
  const [cpError, setCpError] = useState<string | null>(null)
  const [loadingCp, setLoadingCp] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState('Tarjeta simulada')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!nombre.trim()) newErrors.nombre = 'Nombre requerido'
    else if (nombre.trim().length < 3) newErrors.nombre = 'Nombre muy corto'

    if (!telefono.trim()) newErrors.telefono = 'Teléfono requerido'
    else {
      const digits = telefono.replace(/\D/g, '')
      if (!/^\d{7,10}$/.test(digits)) newErrors.telefono = 'Teléfono inválido (7-10 dígitos)'
    }

    if (!codigoPostal.trim()) newErrors.codigoPostal = 'Código postal requerido'
    else if (!/^\d{5}$/.test(codigoPostal)) newErrors.codigoPostal = 'Código postal debe tener 5 dígitos'

    if (!calle.trim()) newErrors.calle = 'Calle requerida'
    if (!numero.trim()) newErrors.numero = 'Número requerido'
    if (!colonia.trim()) newErrors.colonia = 'Colonia requerida'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateField = (field: string, value: string) => {
    const next = { ...errors }
    switch (field) {
      case 'nombre':
        if (!value.trim()) next.nombre = 'Nombre requerido'
        else if (value.trim().length < 3) next.nombre = 'Nombre muy corto'
        else delete next.nombre
        break
      case 'telefono':
        if (!value.trim()) next.telefono = 'Teléfono requerido'
        else {
          const digits = value.replace(/\D/g, '')
          if (!/^\d{7,10}$/.test(digits)) next.telefono = 'Teléfono inválido (7-10 dígitos)'
          else delete next.telefono
        }
        break
      case 'codigoPostal':
        if (!value.trim()) next.codigoPostal = 'Código postal requerido'
        else if (!/^\d{5}$/.test(value)) next.codigoPostal = 'Código postal debe tener 5 dígitos'
        else delete next.codigoPostal
        break
      case 'calle':
        if (!value.trim()) next.calle = 'Calle requerida'
        else delete next.calle
        break
      case 'numero':
        if (!value.trim()) next.numero = 'Número requerido'
        else delete next.numero
        break
      case 'colonia':
        if (!value.trim()) next.colonia = 'Colonia requerida'
        else delete next.colonia
        break
      default:
        break
    }
    setErrors(next)
  }

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
    // run validations
    if (loadingCp) {
      setCpError('Espera a que termine la búsqueda del código postal.')
      return
    }
    const ok = validate()
    if (!ok) {
      // focus first error field (basic)
      const first = Object.keys(errors)[0]
      if (first === 'nombre') document.getElementById('ship-name')?.focus()
      else if (first === 'telefono') document.getElementById('ship-phone')?.focus()
      else if (first === 'codigoPostal') document.getElementById('ship-cp')?.focus()
      else if (first === 'calle') document.getElementById('ship-calle')?.focus()
      else if (first === 'numero') document.getElementById('ship-numero')?.focus()
      else if (first === 'colonia') document.getElementById('ship-colonia')?.focus()
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
                <div>
                  <label htmlFor="ship-name" className="block text-sm mb-1">Nombre del destinatario</label>
                  <input id="ship-name" value={nombre} onChange={e=>{ setNombre(e.target.value); if (errors.nombre) validateField('nombre', e.target.value) }} onBlur={e=>validateField('nombre', e.target.value)} className="p-2 border border-border rounded w-full" aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'ship-name-error' : undefined} />
                  {errors.nombre && <div id="ship-name-error" role="alert" className="text-sm text-red-600 mt-1">{errors.nombre}</div>}
                </div>

                <div>
                  <label htmlFor="ship-phone" className="block text-sm mb-1">Teléfono</label>
                  <input id="ship-phone" value={telefono} onChange={e=>{ setTelefono(e.target.value); if (errors.telefono) validateField('telefono', e.target.value) }} onBlur={e=>validateField('telefono', e.target.value)} className="p-2 border border-border rounded w-full" aria-invalid={!!errors.telefono} aria-describedby={errors.telefono ? 'ship-phone-error' : undefined} />
                  {errors.telefono && <div id="ship-phone-error" role="alert" className="text-sm text-red-600 mt-1">{errors.telefono}</div>}
                </div>

                <div>
                  <label htmlFor="ship-cp" className="block text-sm mb-1">Código postal</label>
                  <input id="ship-cp" value={codigoPostal} onChange={e=>{ setCodigoPostal(e.target.value); if (errors.codigoPostal) validateField('codigoPostal', e.target.value) }} onBlur={e=>validateField('codigoPostal', e.target.value)} className="p-2 border border-border rounded w-full" aria-invalid={!!errors.codigoPostal} aria-describedby={(errors.codigoPostal ? 'ship-cp-error' : '') + (cpError ? ' ship-cp-lookup' : '')} />
                  {loadingCp && <div id="ship-cp-lookup" className="text-sm text-muted">Buscando colonias...</div>}
                  {cpError && <div role="alert" className="text-sm text-red-600">{cpError}</div>}
                  {errors.codigoPostal && <div id="ship-cp-error" role="alert" className="text-sm text-red-600 mt-1">{errors.codigoPostal}</div>}
                </div>

                <div className="p-2">
                  {cpLookupResult && (
                    <>
                      <label htmlFor="ship-colonia" className="block text-sm mb-1">Colonia</label>
                      <select id="ship-colonia" value={colonia} onChange={e=>{ setColonia(e.target.value); if (errors.colonia) validateField('colonia', e.target.value) }} onBlur={e=>validateField('colonia', e.target.value)} className="w-full p-2 border border-border rounded" aria-describedby={errors.colonia ? 'ship-colonia-error' : undefined}>
                        <option value="">Selecciona colonia</option>
                        {cpLookupResult.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.colonia && <div id="ship-colonia-error" role="alert" className="text-sm text-red-600 mt-1">{errors.colonia}</div>}
                    </>
                  )}
                </div>

                <div>
                  <label htmlFor="ship-calle" className="block text-sm mb-1">Calle</label>
                  <input id="ship-calle" value={calle} onChange={e=>{ setCalle(e.target.value); if (errors.calle) validateField('calle', e.target.value) }} onBlur={e=>validateField('calle', e.target.value)} className="p-2 border border-border rounded w-full" aria-invalid={!!errors.calle} aria-describedby={errors.calle ? 'ship-calle-error' : undefined} />
                  {errors.calle && <div id="ship-calle-error" role="alert" className="text-sm text-red-600 mt-1">{errors.calle}</div>}
                </div>

                <div>
                  <label htmlFor="ship-numero" className="block text-sm mb-1">Número</label>
                  <input id="ship-numero" value={numero} onChange={e=>{ setNumero(e.target.value); if (errors.numero) validateField('numero', e.target.value) }} onBlur={e=>validateField('numero', e.target.value)} className="p-2 border border-border rounded w-full" aria-invalid={!!errors.numero} aria-describedby={errors.numero ? 'ship-numero-error' : undefined} />
                  {errors.numero && <div id="ship-numero-error" role="alert" className="text-sm text-red-600 mt-1">{errors.numero}</div>}
                </div>

                <div>
                  <label htmlFor="ship-municipio" className="block text-sm mb-1">Municipio/Delegación</label>
                  <input id="ship-municipio" value={municipio} onChange={e=>setMunicipio(e.target.value)} className="p-2 border border-border rounded w-full" />
                </div>
                <div>
                  <label htmlFor="ship-estado" className="block text-sm mb-1">Estado</label>
                  <input id="ship-estado" value={estado} onChange={e=>setEstado(e.target.value)} className="p-2 border border-border rounded w-full" />
                </div>
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
