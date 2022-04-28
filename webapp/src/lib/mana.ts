import { fromWei, unitMap } from 'web3x/utils'

const MAXIMUM_FRACTION_DIGITS = 2

export function formatWeiMANA(
  wei: string,
  maximumFractionDigits?: number,
  unit: keyof typeof unitMap = 'ether'
): string {
  return Number(fromWei(wei, unit)).toLocaleString(undefined, {
    maximumFractionDigits
  })
}

/**
 * Takes a string representing an ether MANA value and converts it to a two-place decimal number.
 * If the mana value is either negative or invalid, it'll return 0
 */
export function parseMANANumber(
  strMana: string,
  maximumFractionDigits = MAXIMUM_FRACTION_DIGITS
): number {
  const mana = parseFloat(strMana)

  if (isNaN(Number(strMana)) || mana < 0) {
    return 0
  }

  return parseFloat(mana.toFixed(maximumFractionDigits))
}

/**
 * Get's value and tries to parse it with the supplied amount of decimals.
 * It'll return the value as is if it's an invalid number or it doesn't have more than decimals than the upper limit.
 */
export function toFixedMANAValue(
  strValue: string,
  maximumFractionDigits = MAXIMUM_FRACTION_DIGITS
): string {
  const value = parseFloat(strValue)

  if (!isNaN(value)) {
    const decimals = value.toString().split('.')[1]
    const decimalsCount = decimals ? decimals.length : 0

    if (decimalsCount >= maximumFractionDigits) {
      return value.toFixed(maximumFractionDigits)
    }
  }

  return strValue
}
