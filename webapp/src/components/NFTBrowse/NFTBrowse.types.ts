import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { Vendors } from '../../modules/vendor/types'
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
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
}

export type MapStateProps = Pick<Props, 'onlyOnSale' | 'isMap'>
export type MapDispatchProps = Pick<Props, 'onFetchNFTsFromRoute'>
export type MapDispatch = Dispatch<FetchNFTsFromRouteAction>
export type OwnProps = Pick<Props, 'vendor' | 'address'>
