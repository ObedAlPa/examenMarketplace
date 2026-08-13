import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar(){
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-4">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3"><img src="/logo.svg" alt="TenoMerca" className="h-10" /><div className="font-semibold text-lg">TenoMerca</div></Link>
        </div>
        <div className="flex-1 px-6">
          <input placeholder="Busca productos, marcas o categorías" className="w-full p-2 rounded-lg border border-border" />
        </div>
        <div className="flex items-center gap-4">
          {!auth.user && (
            <>
              <Link to="/auth/login" className="text-sm text-primary">Iniciar sesión</Link>
              <Link to="/auth/register" className="text-sm text-primary">Registro</Link>
            </>
          )}

          {auth.user && (
            <>
              <div className="text-sm text-muted">{auth.user.nombre || auth.user.email}</div>
              {auth.user.role === 'admin' && <Link to="/admin" className="text-sm text-primary">Admin</Link>}
              <button onClick={handleLogout} className="bg-white border border-border text-primary px-3 py-1 rounded">Cerrar sesión</button>
            </>
          )}

          <Link to="/cart" className="bg-primary text-white px-3 py-1 rounded">Carrito</Link>
        </div>
      </div>
    </header>
  )
}
