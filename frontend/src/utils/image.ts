const DEFAULT_PLACEHOLDER = '/placeholder.png'

export const normalizeDriveImageUrl = (value?: string | null) => {
  if (!value || typeof value !== 'string') return DEFAULT_PLACEHOLDER

  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_PLACEHOLDER

  if (trimmed.startsWith('drive://')) {
    const driveId = trimmed.replace(/^drive:\/\//i, '').trim()
    if (!driveId) return DEFAULT_PLACEHOLDER
    return `https://drive.google.com/uc?export=view&id=${driveId}`
  }

  const googleDriveMatch = trimmed.match(/(?:\/d\/|[?&]id=)([A-Za-z0-9_-]{3,})/)
  if (googleDriveMatch) {
    return `https://drive.google.com/uc?export=view&id=${googleDriveMatch[1]}`
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed
  }

  return trimmed
}
