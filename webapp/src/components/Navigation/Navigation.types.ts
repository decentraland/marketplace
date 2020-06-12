export enum NavigationTab {
  ATLAS = 'atlas',
  BROWSE = 'browse',
  PARTNERS = 'partners',
  MY_ASSETS = 'my_assets',
  MY_BIDS = 'my_bids',
  ACTIVITY = 'activity'
}

export type Props = {
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = {}
export type MapDispatchProps = {}
