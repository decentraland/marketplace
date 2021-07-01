import { Dispatch } from 'redux'

import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import { browseNFTs, BrowseNFTsAction } from '../../modules/routing/actions'

export type Props = {
  vendor: VendorName
  nfts: NFT[]
  page: number
  count?: number
  isLoading: boolean
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<
  Props,
  'vendor' | 'nfts' | 'page' | 'count' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseNFTsAction>
