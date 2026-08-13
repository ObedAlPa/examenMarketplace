import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'

export default function OrderDetail(){
  const { id } = useParams()
  const [order, setOrder] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    const orders = JSON.parse(localStorage.getItem('tenomerca_orders') || '[]')
    const found = orders.find((o: any) => o.id === id)
    setOrder(found || null)
  }, [id])

  if (!order) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
          <p>El pedido con ID <strong>{id}</strong> no existe o ya no está disponible.</p>
          <Link to="/orders" className="mt-4 inline-block text-primary">Volver a mis pedidos</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Detalle del pedido {order.id}</h1>
        <div className="bg-white p-4 rounded border border-border">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted">Creado: {new Date(order.created_at).toLocaleString()}</div>
              <div className="mt-2 font-semibold">Estado: <span className="px-2 py-1 rounded" style={{background:'#E6A23C'}}>{order.status}</span></div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">Total: ${order.total.toFixed(2)}</div>
              <div className="text-sm text-muted">Pago: {order.paymentMethod} — {order.paymentStatus}</div>
            </div>
          </div>

          <section className="mt-4">
            <h3 className="font-semibold">Artículos</h3>
            <div className="mt-2 space-y-2">
              {order.items.map((it: any) => (
                <div key={it.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{it.titulo}</div>
                    <div className="text-sm text-muted">Cantidad: {it.cantidad} — ${it.precio.toFixed(2)} c/u</div>
                  </div>
                  <div className="font-semibold">${(it.precio*it.cantidad).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h3 className="font-semibold">Dirección de envío</h3>
            <div className="mt-2 text-sm">
              <div><strong>{order.direccion.nombre}</strong></div>
              <div>{order.direccion.calle} {order.direccion.numero}, {order.direccion.colonia}</div>
              <div>{order.direccion.municipio}, {order.direccion.estado} — {order.direccion.codigoPostal}</div>
              <div>Teléfono: {order.direccion.telefono}</div>
            </div>
          </section>

          <div className="mt-6 flex gap-2">
            <Link to="/orders" className="px-4 py-2 rounded border border-border">Volver a mis pedidos</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
