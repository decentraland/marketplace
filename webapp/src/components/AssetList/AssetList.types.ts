import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'

import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import { browse, BrowseAction } from '../../modules/routing/actions'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  nfts: NFT[]
  items: Item[]
  page: number
  count?: number
  isLoading: boolean
  isManager?: boolean
  onBrowse: typeof browse
  urlNext: string
}

export type MapStateProps = Pick<
  Props,
  | 'vendor'
  | 'nfts'
  | 'items'
  | 'page'
  | 'count'
  | 'isLoading'
  | 'assetType'
  | 'urlNext'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
