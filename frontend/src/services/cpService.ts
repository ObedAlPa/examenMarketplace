// cpService: postal code lookup. Uses the backend API when VITE_API_URL is set; falls back to a mock otherwise.

import apiClient from './apiClient'

const API_BASE = import.meta.env.VITE_API_URL || ''

export type CpLookup = { estado: string; municipio: string; colonias: string[] }

const mockLookup = async (cp: string): Promise<CpLookup | null> => {
  // Simulate network latency
  await new Promise(res => setTimeout(res, 400))
  const map: Record<string, CpLookup> = {
    '01000': { estado: 'Ciudad de México', municipio: 'Cuauhtémoc', colonias: ['Centro', 'San Rafael', 'Juárez'] },
    '64000': { estado: 'Nuevo León', municipio: 'Monterrey', colonias: ['Centro', 'Obispado'] },
    '44100': { estado: 'Jalisco', municipio: 'Guadalajara', colonias: ['Centro', 'Americana'] }
  }
  return map[cp] || null
}

export const lookupCp = async (cp: string): Promise<CpLookup | null> => {
  if (API_BASE) {
    try {
      const res = await apiClient.apiFetch(`/api/codigo-postal/${cp}`)
      return { estado: res.estado, municipio: res.municipio, colonias: res.colonias }
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }
  return mockLookup(cp)
}

export default { lookupCp }
