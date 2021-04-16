export enum OrderStatus {
  OPEN = 'open',
  SOLD = 'sold',
  CANCELLED = 'cancelled'
}

export type Order = {
  id: string
  nftId: string
  nftAddress: string
  marketAddress: string
  owner: string
  buyer: string | null
  price: string
  ethPrice?: string
  status: OrderStatus
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
