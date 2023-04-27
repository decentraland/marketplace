import { ethers } from 'ethers'
import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'
import { getMinimumValueForFractionDigits } from '../../lib/mana'

const ONE_MILLION = 1000000
const ONE_BILLION = 1000000000
const ONE_TRILLION = 1000000000000

export function fomrmatWeiToAssetCard(wei: string): string {
  const maximumFractionDigits = MAXIMUM_FRACTION_DIGITS
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

  if (value > ONE_TRILLION) {
    return `${(+value / ONE_TRILLION).toLocaleString()}T`
  } else if (value > ONE_BILLION) {
    return `${(+value / ONE_BILLION).toLocaleString()}B`
  } else if (value > ONE_MILLION) {
    return `${(+value / ONE_MILLION).toLocaleString()}M`
  }

  return fixedValue
}
