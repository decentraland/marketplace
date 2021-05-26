import BN from 'bn.js'

let oneEthInMANA: BN | undefined

export function formatMANA(value: string) {
  if (!oneEthInMANA) {
    oneEthInMANA = new BN('1000000000000000000') // 10 ** 18
  }
  const mana = new BN(value).divRound(oneEthInMANA)
  return mana.toNumber().toLocaleString()
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
