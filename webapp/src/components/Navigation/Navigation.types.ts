export enum NavigationTab {
  OVERVIEW = 'overview',
  CAMPAIGN_BROWSER = 'campaign-browser',
  LANDS = 'lands',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  MY_STORE = 'my_store',
  ACTIVITY = 'activity'
}

export type Props = {
  isCampaignBrowserEnabled: boolean
  isFullScreen?: boolean
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = Pick<
  Props,
  'isCampaignBrowserEnabled' | 'isFullScreen'
>
export type MapDispatchProps = {}
