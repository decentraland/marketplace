import { NFT } from '../../../modules/nft/types'

export type Props = {
  nfts: NFT[]
  title: string
  onViewAll: () => void
}
