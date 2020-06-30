import { Dispatch } from 'redux'

import { NFT } from '../../modules/nft/types'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  nfts: NFT[]
  page: number
  count?: number
  isLoading: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'nfts' | 'page' | 'count' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
