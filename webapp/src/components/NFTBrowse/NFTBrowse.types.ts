import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
import { setView, SetViewAction } from '../../modules/ui/actions'
import {
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  vendor: Vendors
  view: View
  address?: string
  onlyOnSale?: boolean
  isMap?: boolean
  isLoading: boolean
  onSetView: typeof setView
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
}

export type MapStateProps = Pick<Props, 'onlyOnSale' | 'isMap' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onSetView' | 'onFetchNFTsFromRoute'>
export type MapDispatch = Dispatch<SetViewAction | FetchNFTsFromRouteAction>
export type OwnProps = Pick<Props, 'vendor' | 'address'>
