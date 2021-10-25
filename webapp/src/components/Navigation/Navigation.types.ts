export enum NavigationTab {
  LANDS = 'lands',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  PARTNERS = 'partners',
  PARTNER = 'partner',
  MY_STORE = 'my_store',
  MY_BIDS = 'my_bids',
  ACTIVITY = 'activity'
}

export type Props = {
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = {}
export type MapDispatchProps = {}
