export function formatPrice(wei: string) {
  return (parseInt(wei, 10) / 10 ** 18).toLocaleString()
}
