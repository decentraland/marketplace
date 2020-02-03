import { NFT } from '../nft/types'
import { Order } from './types'

export function formatPrice(wei: string) {
  return (parseInt(wei, 10) / 10 ** 18).toLocaleString()
}

export function isExpired(expiresAt: string) {
  return parseInt(expiresAt, 10) < Date.now()
}

export function getActiveOrder(nft: NFT | null, orders: Record<string, Order>) {
  if (!!nft && !!nft.activeOrderId && nft.activeOrderId in orders) {
    return orders[nft.activeOrderId]
  }
  return null
}
