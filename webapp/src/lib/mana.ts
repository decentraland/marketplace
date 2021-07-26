import { fromWei } from 'web3x-es/utils'

export function formatMANA(value: string) {
  return Number(fromWei(value, 'ether')).toLocaleString()
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
