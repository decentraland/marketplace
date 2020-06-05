export const MANA_SYMBOL = '⏣'

export function formatMANA(value: string) {
  return Math.abs(+value / 10 ** 18).toLocaleString()
}

export function toMANA(num: number) {
  return num > 0 ? MANA_SYMBOL + ' ' + num.toString() : ''
}

export function fromMANA(mana: string) {
  const num = mana
    .split(MANA_SYMBOL + ' ')
    .join('')
    .split(/[,|.]/)
    .join('')

  const result = parseInt(num, 10)

  if (isNaN(result) || result < 0) {
    return 0
  }

  return result
}
