/**
 * Addresses are Ethereum's identity system. They look like this:
 * `0x0f5d2fb29fb7d3cfee444a200298f468908cc942`
 *
 * Some addresses have an associated Public Key. These are called "externally owned accounts" in Ethereum.
 *
 * Some addresses are an Ethereum Contract.
 */
export type Address = string
export const ADDRESS_LENGTH = 42

export function isAddress(address: any): address is Address {
  return typeof address === 'string' && address.startsWith('0x') && address.length === ADDRESS_LENGTH
}
