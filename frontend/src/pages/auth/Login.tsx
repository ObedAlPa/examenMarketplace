import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await auth.login(email.trim(), password)
    setLoading(false)
    if (!res.ok) return setError(res.message || 'Error')
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <form onSubmit={submit} className="bg-white p-6 rounded-lg border border-border">
          {error && <div className="mb-3 text-sm text-white bg-red-600 p-2 rounded">{error}</div>}
          <label className="block text-sm mb-1">Correo electrónico</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full p-2 rounded border border-border mb-3" />
          <label className="block text-sm mb-1">Contraseña</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full p-2 rounded border border-border mb-4" />
          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">{loading? 'Ingresando...':'Entrar'}</button>
        </form>
        <p className="text-sm text-muted mt-3">Usa las cuentas de prueba en README para autenticación mock.</p>
      </div>
    </div>
  )
}
