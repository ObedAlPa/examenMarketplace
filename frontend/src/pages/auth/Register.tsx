import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e)

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const navigate = useNavigate()

  const validate = () => {
    const next: Record<string,string> = {}
    if (!name.trim()) next.name = 'Nombre requerido'
    else if (name.trim().length < 3) next.name = 'Nombre muy corto'

    if (!email.trim()) next.email = 'Correo requerido'
    else if (!isValidEmail(email.trim())) next.email = 'Correo inválido'

    if (!password) next.password = 'Contraseña requerida'
    else if (password.length < 8) next.password = 'La contraseña debe tener al menos 8 caracteres'

    if (!confirmPassword) next.confirmPassword = 'Confirma la contraseña'
    else if (password !== confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden'

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
          {message && <div className="mb-3 text-sm text-white bg-success p-2 rounded">{message}</div>}

          <label className="block text-sm mb-1">Nombre completo</label>
          <input value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(s => { const n = {...s}; delete n.name; return n }) }} onBlur={() => { if (errors.name) validate() }} className="w-full p-2 rounded border border-border mb-1" />
          {errors.name && <div className="text-sm text-red-600 mb-3">{errors.name}</div>}

          <label className="block text-sm mb-1">Correo electrónico</label>
          <input value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(s => { const n = {...s}; delete n.email; return n }) }} onBlur={() => { if (errors.email) validate() }} type="email" className="w-full p-2 rounded border border-border mb-1" />
          {errors.email && <div className="text-sm text-red-600 mb-3">{errors.email}</div>}

          <label className="block text-sm mb-1">Contraseña</label>
          <input value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(s => { const n = {...s}; delete n.password; return n }) }} onBlur={() => { if (errors.password) validate() }} type="password" className="w-full p-2 rounded border border-border mb-1" />
          {errors.password && <div className="text-sm text-red-600 mb-3">{errors.password}</div>}

          <label className="block text-sm mb-1">Confirmar contraseña</label>
          <input value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(s => { const n = {...s}; delete n.confirmPassword; return n }) }} onBlur={() => { if (errors.confirmPassword) validate() }} type="password" className="w-full p-2 rounded border border-border mb-4" />
          {errors.confirmPassword && <div className="text-sm text-red-600 mb-3">{errors.confirmPassword}</div>}

          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded font-semibold">Crear cuenta</button>
        </form>
      </div>
    </div>
  )
}
