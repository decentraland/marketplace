import { Dispatch } from 'redux'
import { RouterLocation } from 'connected-react-router'
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
  contracts?: string[]
  isMap?: boolean
  isFullscreen?: boolean
  section?: Section
  sections?: Section[]
  onSetView: typeof setView
  onFetchAssetsFromRoute: typeof fetchAssetsFromRoute
  onBrowse: typeof browse
  onlyOnSale?: boolean
  onlySmart?: boolean
  onlyOnRent?: boolean
  visitedLocations: RouterLocation<unknown>[]
}

export type MapStateProps = Pick<
  Props,
  | 'isMap'
  | 'isFullscreen'
  | 'onlyOnSale'
  | 'viewInState'
  | 'section'
  | 'assetType'
  | 'onlySmart'
  | 'onlyOnRent'
  | 'visitedLocations'
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
  | 'contracts'
>
