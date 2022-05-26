import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'
import { fromWei, unitMap } from 'web3x/utils'

/**
 * Format wei to a supported unit ('ether' by default) and localizes it with the desired fraction digits (2 by default)
 */
export function formatWeiMANA(
  wei: string,
  maximumFractionDigits: number = MAXIMUM_FRACTION_DIGITS,
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

  if (strMana.length === 0 || isNaN(Number(strMana)) || mana < 0) {
    return 0
  }

  return parseFloat(mana.toFixed(maximumFractionDigits))
}
