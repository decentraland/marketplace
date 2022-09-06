import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor/types'
import { setView, SetViewAction } from '../../modules/ui/actions'
import {
  browse,
  BrowseAction,
  fetchAssetsFromRoute,
  FetchAssetsFromRouteAction
} from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/routing/types'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  vendor: VendorName
  view: View
  assetType: AssetType
  viewInState?: View // This is used to know when the view prop has been set in the app state
  address?: string
  isMap?: boolean
  section?: Section
  sections?: Section[]
  isFullscreen: boolean
  isLoading: boolean
  isRentalsEnabled: boolean
  onSetView: typeof setView
  onFetchAssetsFromRoute: typeof fetchAssetsFromRoute
  onBrowse: typeof browse
  onlyOnSale?: boolean
  onlySmart?: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'isMap'
  | 'isLoading'
  | 'onlyOnSale'
  | 'viewInState'
  | 'section'
  | 'assetType'
  | 'onlySmart'
  | 'isRentalsEnabled'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetView' | 'onFetchAssetsFromRoute' | 'onBrowse'
>
export type MapDispatch = Dispatch<
  SetViewAction | FetchAssetsFromRouteAction | BrowseAction
>
export type OwnProps = Pick<
  Props,
  | 'vendor'
  | 'address'
  | 'isFullscreen'
  | 'isMap'
  | 'view'
  | 'sections'
  | 'section'
>
