import { Dispatch } from 'redux'
import {
  openBuyManaWithFiatModalRequest,
  OpenBuyManaWithFiatModalRequestAction
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { browse, BrowseAction } from '../../modules/routing/actions'

export enum NavigationTab {
  OVERVIEW = 'overview',
  CAMPAIGN_BROWSER = 'campaign-browser',
  LANDS = 'lands',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  MY_STORE = 'my_store',
  MY_LISTS = 'my_lists',
  ACTIVITY = 'activity'
}

export type Props = {
  isCampaignBrowserEnabled: boolean
  isFullScreen?: boolean
  activeTab?: NavigationTab
  isFullscreen?: boolean
  onOpenBuyManaWithFiatModal: () => ReturnType<
    typeof openBuyManaWithFiatModalRequest
  >
  onBrowse: typeof browse
}

export type MapDispatch = Dispatch<
  OpenBuyManaWithFiatModalRequestAction | BrowseAction
>

export type MapStateProps = Pick<
  Props,
  'isCampaignBrowserEnabled' | 'isFullScreen'
>
export type MapDispatchProps = Pick<
  Props,
  'onOpenBuyManaWithFiatModal' | 'onBrowse'
>
