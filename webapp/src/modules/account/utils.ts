import { toBN } from 'web3x/utils'
import { AccountMetrics } from './types'

const addStrings = (a: string, b: string) => {
  const bnA = toBN(a)
  const bnB = toBN(b)

  return bnA.add(bnB).toString()
}

export const sumAccountMetrics = (a: AccountMetrics, b: AccountMetrics) => {
  return {
    ...a,
    purchases: a.purchases + b.purchases,
    sales: a.sales + b.sales,
    earned: addStrings(a.earned, b.earned),
    royalties: addStrings(a.royalties, b.royalties),
    spent: addStrings(a.spent, b.spent)
  }
}
