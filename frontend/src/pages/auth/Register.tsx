import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateRegister } from '../../services/form'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const navigate = useNavigate()

  const validate = () => {
    const next = validateRegister(name, email, password, confirmPassword)
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Mock register: simply show success and redirect to login
    setMessage('Cuenta creada (modo mock). Ahora puedes iniciar sesión con tus credenciales.')
    setTimeout(() => navigate('/auth/login'), 1200)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>
        <form onSubmit={submit} className="bg-white p-6 rounded-lg border border-border">
          {message && <div role="status" aria-live="polite" className="mb-3 text-sm text-white bg-success p-2 rounded">{message}</div>}

          <label htmlFor="register-name" className="block text-sm mb-1">Nombre completo</label>
          <input id="register-name" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(s => { const n = {...s}; delete n.name; return n }) }} onBlur={() => { if (errors.name) validate() }} className="w-full p-2 rounded border border-border mb-1" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'register-name-error' : undefined} />
          {errors.name && <div id="register-name-error" role="alert" className="text-sm text-red-600 mb-3">{errors.name}</div>}

          <label htmlFor="register-email" className="block text-sm mb-1">Correo electrónico</label>
          <input id="register-email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(s => { const n = {...s}; delete n.email; return n }) }} onBlur={() => { if (errors.email) validate() }} type="email" className="w-full p-2 rounded border border-border mb-1" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'register-email-error' : undefined} />
          {errors.email && <div id="register-email-error" role="alert" className="text-sm text-red-600 mb-3">{errors.email}</div>}

          <label htmlFor="register-password" className="block text-sm mb-1">Contraseña</label>
          <input id="register-password" value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(s => { const n = {...s}; delete n.password; return n }) }} onBlur={() => { if (errors.password) validate() }} type="password" className="w-full p-2 rounded border border-border mb-1" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'register-password-error' : undefined} />
          {errors.password && <div id="register-password-error" role="alert" className="text-sm text-red-600 mb-3">{errors.password}</div>}

          <label htmlFor="register-confirm" className="block text-sm mb-1">Confirmar contraseña</label>
          <input id="register-confirm" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(s => { const n = {...s}; delete n.confirmPassword; return n }) }} onBlur={() => { if (errors.confirmPassword) validate() }} type="password" className="w-full p-2 rounded border border-border mb-4" aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined} />
          {errors.confirmPassword && <div id="register-confirm-error" role="alert" className="text-sm text-red-600 mb-3">{errors.confirmPassword}</div>}

          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">Crear cuenta</button>
        </form>
      </div>
    </div>
  )
}
