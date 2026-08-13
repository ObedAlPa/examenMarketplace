import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar(){
  const auth = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  useEffect(() => {
    function onDoc(e: MouseEvent){
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

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
            <div className="relative" ref={ref}>
              <button onClick={() => setOpen(s => !s)} className="flex items-center gap-2 px-3 py-1 rounded bg-white border border-border">
                <span className="text-sm text-muted">{auth.user.nombre || auth.user.email}</span>
                <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded shadow-md z-20">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-50">Mi cuenta</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50">Mis pedidos</Link>
                  {auth.user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50">Admin</Link>}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50">Cerrar sesión</button>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="bg-primary text-white px-3 py-1 rounded">Carrito</Link>
        </div>
      </div>
    </header>
  )
}
