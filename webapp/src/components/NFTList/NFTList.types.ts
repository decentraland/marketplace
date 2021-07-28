import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'

import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import { browseNFTs, BrowseNFTsAction } from '../../modules/routing/actions'
import { ResultType } from '../../modules/routing/types'

export type Props = {
  vendor: VendorName
  resultType: ResultType
  nfts: NFT[]
  items: Item[]
  page: number
  count?: number
  isLoading: boolean
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<
  Props,
  'vendor' | 'nfts' | 'items' | 'page' | 'count' | 'isLoading' | 'resultType'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseNFTsAction>
