export const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e)

export const validateLogin = (email: string, password: string) => {
  const errors: Record<string, string> = {}
  if (!email?.trim()) errors.email = 'Correo requerido'
  else if (!isValidEmail(email.trim())) errors.email = 'Correo inválido'
  if (!password) errors.password = 'Contraseña requerida'
  else if (password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres'
  return errors
}

export const validateRegister = (name: string, email: string, password: string, confirmPassword: string) => {
  const errors: Record<string, string> = {}
  if (!name?.trim()) errors.name = 'Nombre requerido'
  else if (name.trim().length < 3) errors.name = 'Nombre muy corto'

  if (!email?.trim()) errors.email = 'Correo requerido'
  else if (!isValidEmail(email.trim())) errors.email = 'Correo inválido'

  if (!password) errors.password = 'Contraseña requerida'
  else if (password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres'

  if (!confirmPassword) errors.confirmPassword = 'Confirma la contraseña'
  else if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'

  return errors
}

export const validateCheckout = (fields: {
  nombre: string
  telefono: string
  codigoPostal: string
  calle: string
  numero: string
  colonia: string
}) => {
  const { nombre, telefono, codigoPostal, calle, numero, colonia } = fields
  const newErrors: Record<string, string> = {}
  if (!nombre?.trim()) newErrors.nombre = 'Nombre requerido'
  else if (nombre.trim().length < 3) newErrors.nombre = 'Nombre muy corto'

  if (!telefono?.trim()) newErrors.telefono = 'Teléfono requerido'
  else {
    const digits = telefono.replace(/\D/g, '')
    if (!/^\d{7,10}$/.test(digits)) newErrors.telefono = 'Teléfono inválido (7-10 dígitos)'
  }

  if (!codigoPostal?.trim()) newErrors.codigoPostal = 'Código postal requerido'
  else if (!/^\d{5}$/.test(codigoPostal)) newErrors.codigoPostal = 'Código postal debe tener 5 dígitos'

  if (!calle?.trim()) newErrors.calle = 'Calle requerida'
  if (!numero?.trim()) newErrors.numero = 'Número requerido'
  if (!colonia?.trim()) newErrors.colonia = 'Colonia requerida'

  return newErrors
}

export const validateCheckoutField = (field: string, value: string) => {
  switch (field) {
    case 'nombre':
      if (!value?.trim()) return 'Nombre requerido'
      if (value.trim().length < 3) return 'Nombre muy corto'
      return ''
    case 'telefono':
      if (!value?.trim()) return 'Teléfono requerido'
      const digits = value.replace(/\D/g, '')
      if (!/^\d{7,10}$/.test(digits)) return 'Teléfono inválido (7-10 dígitos)'
      return ''
    case 'codigoPostal':
      if (!value?.trim()) return 'Código postal requerido'
      if (!/^\d{5}$/.test(value)) return 'Código postal debe tener 5 dígitos'
      return ''
    case 'calle':
      if (!value?.trim()) return 'Calle requerida'
      return ''
    case 'numero':
      if (!value?.trim()) return 'Número requerido'
      return ''
    case 'colonia':
      if (!value?.trim()) return 'Colonia requerida'
      return ''
    default:
      return ''
  }
}
