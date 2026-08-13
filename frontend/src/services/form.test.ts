import { describe, it, expect } from 'vitest'
import { validateLogin, validateRegister, validateCheckout, validateCheckoutField } from './form'

describe('form validation', () => {
  describe('validateLogin', () => {
    it('returns errors for empty fields', () => {
      const errors = validateLogin('', '')
      expect(errors.email).toBeDefined()
      expect(errors.password).toBeDefined()
    })

    it('validates email format and password length', () => {
      const errors = validateLogin('bad-email', '123')
      expect(errors.email).toBe('Correo inválido')
      expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres')
    })

    it('passes for valid inputs', () => {
      const errors = validateLogin('user@example.com', 'abcdef')
      expect(Object.keys(errors).length).toBe(0)
    })
  })

  describe('validateRegister', () => {
    it('returns errors for missing fields', () => {
      const errors = validateRegister('', '', '', '')
      expect(errors.name).toBeDefined()
      expect(errors.email).toBeDefined()
      expect(errors.password).toBeDefined()
      expect(errors.confirmPassword).toBeDefined()
    })

    it('checks password length and mismatch', () => {
      const errors = validateRegister('Jo', 'user@x.com', 'short', 'other')
      expect(errors.name).toBe('Nombre muy corto')
      expect(errors.password).toBe('La contraseña debe tener al menos 8 caracteres')
      expect(errors.confirmPassword).toBe('Las contraseñas no coinciden')
    })

    it('passes for good inputs', () => {
      const errors = validateRegister('John Doe', 'john@example.com', 'strongpass', 'strongpass')
      expect(Object.keys(errors).length).toBe(0)
    })
  })

  describe('validateCheckout', () => {
    it('returns errors for missing address fields', () => {
      const errors = validateCheckout({ nombre: '', telefono: '', codigoPostal: '', calle: '', numero: '', colonia: '' })
      expect(errors.nombre).toBeDefined()
      expect(errors.telefono).toBeDefined()
      expect(errors.codigoPostal).toBeDefined()
      expect(errors.calle).toBeDefined()
      expect(errors.numero).toBeDefined()
      expect(errors.colonia).toBeDefined()
    })

    it('validates phone and cp formats', () => {
      const errors = validateCheckout({ nombre: 'Ana', telefono: '12ab', codigoPostal: '123', calle: 'C', numero: '1', colonia: 'X' })
      expect(errors.telefono).toBe('Teléfono inválido (7-10 dígitos)')
      expect(errors.codigoPostal).toBe('Código postal debe tener 5 dígitos')
    })

    it('passes for valid address', () => {
      const errors = validateCheckout({ nombre: 'Ana', telefono: '5512345678', codigoPostal: '01000', calle: 'Av', numero: '12', colonia: 'Centro' })
      expect(Object.keys(errors).length).toBe(0)
    })
  })

  describe('validateCheckoutField', () => {
    it('returns correct messages per field', () => {
      expect(validateCheckoutField('nombre', '')).toBe('Nombre requerido')
      expect(validateCheckoutField('telefono', 'a')).toBe('Teléfono inválido (7-10 dígitos)')
      expect(validateCheckoutField('codigoPostal', 'abc')).toBe('Código postal debe tener 5 dígitos')
      expect(validateCheckoutField('calle', '')).toBe('Calle requerida')
      expect(validateCheckoutField('numero', '')).toBe('Número requerido')
      expect(validateCheckoutField('colonia', '')).toBe('Colonia requerida')
    })
  })
})
