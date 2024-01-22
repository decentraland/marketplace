import { BalanceItem } from '@covalenthq/client-sdk'

export type Balance = Omit<BalanceItem, 'balance' | 'balance_24h'> & {
  balance: string | null
  balance_24h: string | null
}
