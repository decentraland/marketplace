import { Dispatch } from 'redux'
import { AssetType } from '../../modules/asset/types'
import { browse, BrowseAction, fetchAssetsFromRoute, FetchAssetsFromRouteAction } from '../../modules/routing/actions'
import { setView, SetViewAction } from '../../modules/ui/actions'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/routing/types'
import { VendorName } from '../../modules/vendor/types'
import { AssetStatusFilter } from '../../utils/filters'

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
  status?: AssetStatusFilter
  onSetView: typeof setView
  onFetchAssetsFromRoute: typeof fetchAssetsFromRoute
  onBrowse: typeof browse
  onlyOnSale?: boolean
  onlySmart?: boolean
  disableSearchDropdown?: boolean
  onlyOnRent?: boolean
}

export type MapStateProps = Pick<
  Props,
  'isMap' | 'isFullscreen' | 'onlyOnSale' | 'viewInState' | 'section' | 'assetType' | 'onlySmart' | 'onlyOnRent' | 'status'
>
export type MapDispatchProps = Pick<Props, 'onSetView' | 'onFetchAssetsFromRoute' | 'onBrowse'>
export type MapDispatch = Dispatch<SetViewAction | FetchAssetsFromRouteAction | BrowseAction>
export type OwnProps = Pick<
  Props,
  'vendor' | 'address' | 'isFullscreen' | 'isMap' | 'view' | 'sections' | 'section' | 'contracts' | 'disableSearchDropdown'
>
