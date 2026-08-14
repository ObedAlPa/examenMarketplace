import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import orderService from '../services/orderService'

export default function Orders(){
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    orderService.fetchMyOrders().then(o => setOrders(o.reverse()))
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
        {orders.length === 0 ? (
          <p className="text-muted mt-2">No hay pedidos registrados aún.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map(o => (
              <Link key={o.id} to={`/orders/${o.id}`} className="block bg-white p-4 rounded border border-border hover:shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Pedido {o.id}</div>
                    <div className="text-sm text-muted">Creado: {new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${o.total.toFixed(2)}</div>
                    <div className="text-sm mt-1"><span className="px-2 py-1 rounded" style={{background:'#E6A23C'}}> {o.status} </span></div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="font-semibold">Dirección</div>
                  <div>{o.direccion.calle} {o.direccion.numero}, {o.direccion.colonia}, {o.direccion.municipio}, {o.direccion.estado}, {o.direccion.codigoPostal}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
