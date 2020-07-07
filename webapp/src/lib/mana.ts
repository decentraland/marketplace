import BN from 'bn.js'

const MANA_SYMBOL = '⏣'

let oneEthInMANA: BN | undefined

export function formatMANA(value: string) {
  return fromWei(value).toLocaleString()
}

export function toMANA(num: number) {
  return num > 0 ? `${MANA_SYMBOL} ${num.toString()}` : ''
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

export function fromWei(value: BN | string) {
  if (!oneEthInMANA) {
    oneEthInMANA = new BN('1000000000000000000') // 10 ** 18
  }
  return new BN(value).divRound(oneEthInMANA)
}
