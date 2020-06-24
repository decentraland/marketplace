import { NFT } from '../../modules/nft/types'

export type Props = {
  nfts: NFT[]
  page: number
  count?: number
  isLoading: boolean
}

export type MapStateProps = Props
