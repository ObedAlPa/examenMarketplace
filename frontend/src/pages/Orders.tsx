import React from 'react'
import Navbar from '../components/ui/Navbar'

export default function Orders(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
        <p className="text-muted mt-2">Aquí aparecerá el historial de pedidos del usuario cuando el backend esté integrado (mock por ahora).</p>
      </main>
    </div>
  )
}
