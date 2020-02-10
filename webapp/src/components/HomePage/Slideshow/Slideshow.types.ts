import { NFT } from '../../../modules/nft/types'

export type Props = {
  nfts: NFT[]
  isLoading: boolean
  title: string
  onViewAll: () => void
}
