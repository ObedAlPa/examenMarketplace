import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import orderService from '../services/orderService'
import { formatPrice } from '../utils/format'

export default function OrderDetail(){
  const { id } = useParams()
  const [order, setOrder] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    orderService.getOrderById(id).then(found => setOrder(found || null))
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
              <div className="mt-2 text-sm">Items: {order.items.length} (cantidad total: {order.items.reduce((s: number, it: any) => s + it.cantidad, 0)})</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">Total: {formatPrice(order.total)}</div>
              <div className="text-sm text-muted">Estado: {order.status}</div>
            </div>
          </div>

          <section className="mt-4">
            <h3 className="font-semibold">Artículos (línea mínima)</h3>
            <div className="mt-2 space-y-2">
              {order.items.map((it: any) => (
                <div key={it.id} className="flex justify-between">
                  <div className="text-sm">{it.titulo} x{it.cantidad}</div>
                  <div className="text-sm font-semibold">{formatPrice(it.precio * it.cantidad)}</div>
                </div>
              ))}
            </div>
          </section>

          {(order.metodo_pago || order.estado_pago) && (
            <section className="mt-4">
              <h3 className="font-semibold">Pago</h3>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-sm">Método: <span className="font-medium">{order.metodo_pago || '—'}</span></div>
                <div className="text-sm flex items-center gap-1">
                  Estado:
                  <span className="px-2 py-1 rounded text-white" style={{ background: order.estado_pago === 'Pagado' ? '#67C23A' : '#E6A23C' }}>
                    {order.estado_pago || '—'}
                  </span>
                </div>
              </div>
            </section>
          )}

          <div className="mt-4">
            <Link to="/orders" className="px-4 py-2 rounded border border-border">Volver a mis pedidos</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
