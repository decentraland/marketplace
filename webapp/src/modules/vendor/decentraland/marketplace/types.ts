import { BalanceItem } from '@covalenthq/client-sdk'

export type Balance = Omit<BalanceItem, 'balance' | 'balance_24h'> & {
  balance: string | null
  balance_24h: string | null
}

export type WertMessage = {
  address: string
  commodity: string
  commodity_amount: number
  network: string
  sc_address: string
  sc_input_data: string
}
