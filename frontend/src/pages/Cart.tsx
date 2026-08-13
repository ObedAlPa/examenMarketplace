import React from 'react'
import Navbar from '../components/ui/Navbar'
import { useCart } from '../context/CartContext'

export default function Cart(){
  const { items, updateQuantity, removeItem, total, clear } = useCart()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Carrito</h1>
        {items.length === 0 ? (
          <div className="bg-white p-6 rounded border border-border">Tu carrito está vacío.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-4 rounded border border-border">
              {items.map(it => (
                <div key={it.id} className="flex items-center gap-4 py-3 border-b border-border">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden"><img src={it.archivo_url || '/placeholder.png'} alt={it.titulo} className="w-full h-full object-cover" /></div>
                  <div className="flex-1">
                    <div className="font-semibold">{it.titulo}</div>
                    <div className="text-sm text-muted">${it.precio.toFixed(2)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(it.id, Math.max(1, it.cantidad - 1))} className="px-2 py-1 border rounded">-</button>
                      <div className="px-3">{it.cantidad}</div>
                      <button onClick={() => updateQuantity(it.id, it.cantidad + 1)} className="px-2 py-1 border rounded">+</button>
                      <button onClick={() => removeItem(it.id)} className="ml-4 text-sm text-red-600">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="md:col-span-1 bg-white p-4 rounded border border-border">
              <h4 className="font-semibold">Resumen</h4>
              <div className="mt-4 flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="mt-6">
                <button className="w-full bg-primary text-white px-4 py-2 rounded">Proceder a pagar (simulado)</button>
              </div>
              <div className="mt-3">
                <button onClick={() => clear()} className="w-full border border-border px-4 py-2 rounded">Vaciar carrito</button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
