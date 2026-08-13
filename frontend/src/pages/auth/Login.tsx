import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validateLogin } from '../../services/form'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const auth = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const next = validateLogin(email, password)
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
          {error && <div id="login-error" role="alert" className="mb-3 text-sm text-white bg-red-600 p-2 rounded">{error}</div>}

          <label htmlFor="login-email" className="block text-sm mb-1">Correo electrónico</label>
          <input id="login-email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(s => { const n = {...s}; delete n.email; return n }) }} onBlur={() => { if (errors.email) validate() }} type="email" className="w-full p-2 rounded border border-border mb-1" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'login-email-error' : undefined} />
          {errors.email && <div id="login-email-error" role="alert" className="text-sm text-red-600 mb-3">{errors.email}</div>}

          <label htmlFor="login-password" className="block text-sm mb-1">Contraseña</label>
          <input id="login-password" value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(s => { const n = {...s}; delete n.password; return n }) }} onBlur={() => { if (errors.password) validate() }} type="password" className="w-full p-2 rounded border border-border mb-2" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'login-password-error' : undefined} />
          {errors.password && <div id="login-password-error" role="alert" className="text-sm text-red-600 mb-3">{errors.password}</div>}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">{loading? 'Ingresando...':'Entrar'}</button>
        </form>
        <p className="text-sm text-muted mt-3">Usa las cuentas de prueba en README para autenticación mock.</p>
      </div>
    </div>
  )
}
