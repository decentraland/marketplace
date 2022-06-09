import { ethers } from 'ethers'
import { AccountMetrics } from './types'

export function sumAccountMetrics(a: AccountMetrics, b: AccountMetrics) {
  return {
    ...a,
    purchases: a.purchases + b.purchases,
    sales: a.sales + b.sales,
    earned: addStrings(a.earned, b.earned),
    royalties: addStrings(a.royalties, b.royalties),
    spent: addStrings(a.spent, b.spent)
  }
}

function addStrings(a: string, b: string) {
  return ethers.BigNumber.from(a)
    .add(b)
    .toString()
}
