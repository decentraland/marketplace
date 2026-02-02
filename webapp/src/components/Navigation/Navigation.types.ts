import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { clearFilters } from '../../modules/routing/actions'

export enum NavigationTab {
  OVERVIEW = 'overview',
  CAMPAIGN_BROWSER = 'campaign-browser',
  LANDS = 'lands',
  NAMES = 'names',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  MY_STORE = 'my_store',
  MY_LISTS = 'my_lists',
  ACTIVITY = 'activity',
  MERCH = 'merch'
}

export type Props = {
  isCampaignBrowserEnabled: boolean
  activeTab?: NavigationTab
  isFullscreen?: boolean
  campaignTab?: string
  onOpenBuyManaWithFiatModal: ActionFunction<typeof openBuyManaWithFiatModalRequest>
  onClearFilters: ActionFunction<typeof clearFilters>
}

export type ContainerProps = Pick<Props, 'activeTab'>
