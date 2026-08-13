import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock register: simply show success and redirect to login
    setMessage('Cuenta creada (modo mock). Ahora puedes iniciar sesión con tus credenciales.')
    setTimeout(() => navigate('/auth/login'), 1200)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <form onSubmit={submit} className="bg-white p-6 rounded-lg border border-border">
          {message && <div className="mb-3 text-sm text-white bg-success p-2 rounded">{message}</div>}
          <label className="block text-sm mb-1">Nombre completo</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded border border-border mb-3" />
          <label className="block text-sm mb-1">Correo electrónico</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full p-2 rounded border border-border mb-3" />
          <label className="block text-sm mb-1">Contraseña</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full p-2 rounded border border-border mb-4" />
          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">Crear cuenta</button>
        </form>
      </div>
    </div>
  )
}
