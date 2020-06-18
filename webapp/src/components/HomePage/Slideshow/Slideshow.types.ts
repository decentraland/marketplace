import { NFT } from '../../../modules/nft/types'

export type Props = {
  title: string
  nfts: NFT[]
  isSubHeader?: boolean
  isLoading: boolean
  onViewAll: () => void
}
