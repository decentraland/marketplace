import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT | null
}

export type HistoryEvent = {
  from: string
  to: string
  price: string
  updatedAt: string
}
