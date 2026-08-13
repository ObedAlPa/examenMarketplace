import React from 'react'
import Logo from '../../../public/logo.svg'

export default function Navbar(){
  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-4">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="TenoMerca" className="h-10" />
          <div className="font-semibold text-lg">TenoMerca</div>
        </div>
        <div className="flex-1 px-6">
          <input placeholder="Busca productos, marcas o categorías" className="w-full p-2 rounded-lg border border-border" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-primary">Iniciar sesión</button>
          <button className="text-sm text-primary">Registro</button>
          <button className="bg-primary text-white px-3 py-1 rounded">Carrito</button>
        </div>
      </div>
    </header>
  )
}
