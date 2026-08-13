import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e)

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const auth = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const next: Record<string,string> = {}
    if (!email.trim()) next.email = 'Correo requerido'
    else if (!isValidEmail(email.trim())) next.email = 'Correo inválido'
    if (!password) next.password = 'Contraseña requerida'
    else if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const ok = validate()
    if (!ok) return
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
          <input value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(s => { const n = {...s}; delete n.email; return n }) }} onBlur={() => { if (errors.email) validate() }} type="email" className="w-full p-2 rounded border border-border mb-1" aria-invalid={!!errors.email} />
          {errors.email && <div className="text-sm text-red-600 mb-3">{errors.email}</div>}

          <label className="block text-sm mb-1">Contraseña</label>
          <input value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(s => { const n = {...s}; delete n.password; return n }) }} onBlur={() => { if (errors.password) validate() }} type="password" className="w-full p-2 rounded border border-border mb-2" aria-invalid={!!errors.password} />
          {errors.password && <div className="text-sm text-red-600 mb-3">{errors.password}</div>}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">{loading? 'Ingresando...':'Entrar'}</button>
        </form>
        <p className="text-sm text-muted mt-3">Usa las cuentas de prueba en README para autenticación mock.</p>
      </div>
    </div>
  )
}
