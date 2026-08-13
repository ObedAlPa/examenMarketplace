import React, { useEffect, useState } from 'react'
import Navbar from '../components/ui/Navbar'
import orderService from '../services/orderService'

export default function AdminUsersOrders(){
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    orderService.fetchOrders().then(list => { if (mounted) setOrders(list) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin — Usuarios y Pedidos (mock)</h1>
        <div className="bg-white p-4 rounded border border-border">
          <p className="mb-4 text-sm text-muted">Lista mock de pedidos. Usuarios mock no implementados en este entorno; mostrar pedidos permite revisar estados y datos mínimos.</p>

          {orders.length === 0 ? (
            <div className="text-sm text-muted">No hay pedidos mock.</div>
          ) : (
            <div className="space-y-2">
              {orders.map(o => (
                <div key={o.id} className="p-2 border border-border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{o.id}</div>
                      <div className="text-sm text-muted">{new Date(o.created_at).toLocaleString()} — {o.direccion?.nombre || '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${o.total?.toFixed?.(2) ?? o.total}</div>
                      <div className="text-sm text-muted">{o.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
