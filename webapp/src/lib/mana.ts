import { ethers } from 'ethers'
import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'

/**
 * Format wei to a supported unit ('ether' by default) and localizes it with the desired fraction digits (2 by default)
 *
 * A missing amount formats as an empty string. Listings can reach the client without a price (the API takes it
 * from the order or, failing that, from the trade's received amount), and ethers would otherwise throw on `null`
 * in the middle of a render or a saga.
 */
export function formatWeiMANA(wei: string | null | undefined, maximumFractionDigits: number = MAXIMUM_FRACTION_DIGITS): string {
  if (wei === null || wei === undefined || wei === '') {
    return ''
  }

  const value = Number(ethers.utils.formatEther(wei))

  if (value === 0) {
    return '0'
  }

  const fixedValue = value.toLocaleString(undefined, {
    maximumFractionDigits
  })

  if (fixedValue === '0') {
    return getMinimumValueForFractionDigits(maximumFractionDigits).toString()
  }

  return fixedValue
}

/**
 * Takes a string representing an ether MANA value and converts it to a two-place decimal number.
 * If the mana value is either negative or invalid, it'll return 0
 */
export function parseMANANumber(strMana: string, maximumFractionDigits = MAXIMUM_FRACTION_DIGITS): number {
  const mana = parseFloat(strMana)

  if (strMana.length === 0 || isNaN(Number(strMana)) || mana < 0) {
    return 0
  }

  const fixedValue = parseFloat(mana.toFixed(maximumFractionDigits))

  if (fixedValue === 0) {
    return getMinimumValueForFractionDigits(maximumFractionDigits)
  }

  return fixedValue
}

/**
 * returns the minimum value that can be given the maximum fraction digits
 */
export function getMinimumValueForFractionDigits(maximumFractionDigits: number) {
  return Math.pow(10, -maximumFractionDigits)
}
