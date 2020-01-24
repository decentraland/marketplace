export function formatPrice(wei: string) {
  return (parseInt(wei, 10) / 10 ** 18).toLocaleString()
}

export function isExpired(expiresAt: string) {
  return parseInt(expiresAt, 10) < Date.now()
}
