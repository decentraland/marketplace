export const TRANSACTIONS_API_URL = process.env.REACT_APP_TRANSACTIONS_API_URL

export function shortenAddress(address: string) {
  if (address) {
    return address.slice(0, 6) + '...' + address.slice(42 - 5)
  }
}

export function addressEquals(address1?: string, address2?: string) {
  return (
    address1 !== undefined &&
    address2 !== undefined &&
    address1.toLowerCase() === address2.toLowerCase()
  )
}
