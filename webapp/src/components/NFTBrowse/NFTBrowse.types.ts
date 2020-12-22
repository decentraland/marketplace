import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { setView, SetViewAction } from '../../modules/ui/actions'
import {
  browse,
  BrowseAction,
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  vendor: Vendors
  view: View
  address?: string
  isMap?: boolean
  isFullscreen?: boolean
  isLoading: boolean
  onSetView: typeof setView
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
  onBrowse: typeof browse
  showOnSale?: boolean
}

export type MapStateProps = Pick<
  Props,
  'isMap' | 'isLoading' | 'showOnSale' | 'isFullscreen'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetView' | 'onFetchNFTsFromRoute' | 'onBrowse'
>
export type MapDispatch = Dispatch<
  SetViewAction | FetchNFTsFromRouteAction | BrowseAction
>
export type OwnProps = Pick<Props, 'vendor' | 'address'>
