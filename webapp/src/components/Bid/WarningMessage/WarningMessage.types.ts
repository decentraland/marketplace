import { Bid } from '../../../modules/bid/types'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  address: string
  nft: NFT | null
  bid: Bid
}
