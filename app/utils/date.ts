export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC', ...opts })
}

export function formatShortDate(value: string | Date) {
  return formatDate(value, { day: '2-digit', month: 'short' }).replace('.', '').replace(' de ', ' ')
}

export function yearOf(value: string | Date) {
  return new Date(value).getUTCFullYear()
}
