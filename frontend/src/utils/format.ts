// Formatea un precio a moneda. El backend con PostgreSQL devuelve columnas
// NUMERIC como string ("1299.00"), así que normalizamos con Number() antes
// de formatear para evitar TypeError en .toFixed().
export const formatPrice = (value: unknown): string => {
  const num = Number(value)
  if (!Number.isFinite(num)) return '$0.00'
  return `$${num.toFixed(2)}`
}
