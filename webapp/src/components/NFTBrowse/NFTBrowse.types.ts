import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor/types'
import { setView, SetViewAction } from '../../modules/ui/actions'
import {
  browseNFTs,
  BrowseNFTsAction,
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/decentraland'
import { ResultType } from '../../modules/routing/types'

export type Props = {
  vendor: VendorName
  view: View
  resultType: ResultType
  viewInState?: View // This is used to know when the view prop has been set in the app state
  address?: string
  isMap?: boolean
  section?: Section
  sections?: Section[]
  isFullscreen: boolean
  isLoading: boolean
  onSetView: typeof setView
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
  onBrowse: typeof browseNFTs
  onlyOnSale?: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'isMap'
  | 'isLoading'
  | 'onlyOnSale'
  | 'viewInState'
  | 'section'
  | 'resultType'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetView' | 'onFetchNFTsFromRoute' | 'onBrowse'
>
export type MapDispatch = Dispatch<
  SetViewAction | FetchNFTsFromRouteAction | BrowseNFTsAction
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
