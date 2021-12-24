import { fromWei } from 'web3x/utils'

export function formatMANA(value: string, fixed?: number) {
  return Number(fromWei(value, 'ether')).toLocaleString(undefined, {
    maximumFractionDigits: fixed
  })
}

export function toMANA(num: number) {
  return num > 0 ? num.toString() : ''
}

export function fromMANA(mana: string) {
  const num = mana.split(/[,|.]/).join('')

  const result = parseInt(num, 10)

  if (isNaN(result) || result < 0) {
    return 0
  }

  return result
}
