import React from 'react'
import Navbar from '../components/ui/Navbar'

export default function Account(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <p className="text-muted mt-2">Página de perfil de usuario (mock). Aquí se mostrarán datos de la cuenta, direcciones y opciones de edición cuando el backend esté disponible.</p>
      </main>
    </div>
  )
}
