type ApiError = {
  status?: number
  message: string
  body?: any
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const getToken = () => {
  try { return localStorage.getItem('tenomerca_token') } catch { return null }
}

const buildUrl = (path: string) => {
  if (!API_BASE) throw { message: 'No API base configured' } as ApiError
  return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`
}

export const apiFetch = async (path: string, opts: RequestInit = {}) => {
  if (!API_BASE) throw { message: 'No API base configured' } as ApiError

  const headers: Record<string, string> = { ...(opts.headers as Record<string, string> || {}) }
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(buildUrl(path), { ...opts, headers })
    const text = await res.text()
    const contentType = res.headers.get('content-type') || ''
    const body = contentType.includes('application/json') && text ? JSON.parse(text) : text

    if (!res.ok) {
      const message = (body && body.message) ? body.message : `HTTP ${res.status}`
      const err: ApiError = { status: res.status, message, body }
      throw err
    }

    return body
  } catch (err: any) {
    if (err && err.message && typeof err.message === 'string') throw err
    throw { message: (err && err.toString && err.toString()) || 'Network error' } as ApiError
  }
}

export default { apiFetch }
