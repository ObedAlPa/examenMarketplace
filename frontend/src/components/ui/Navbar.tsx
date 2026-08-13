import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar(){
  const auth = useAuth()
  const navigate = useNavigate()
  const { count } = useCart()
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
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded shadow-md z-20">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-50">Mi cuenta</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50">Mis pedidos</Link>
                  {auth.user.role === 'admin' && (
                    <div>
                      <div className="border-t border-border mt-1" />
                      <div className="px-2 py-1 text-xs text-muted">Admin</div>
                      <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-50">Productos</Link>
                      <Link to="/admin/categories" className="block px-4 py-2 hover:bg-gray-50">Categorías</Link>
                      <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-50">Usuarios</Link>
                      <Link to="/admin/users-orders" className="block px-4 py-2 hover:bg-gray-50">Pedidos (admin)</Link>
                    </div>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50">Cerrar sesión</button>
                </div>
              )}            </div>
          )}

          <Link to="/cart" className="relative bg-primary text-white px-3 py-1 rounded">Carrito
                      <span className="absolute -top-2 -right-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs border border-border">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
