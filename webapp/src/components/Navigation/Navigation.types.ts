export enum NavigationTab {
  OVERVIEW = 'overview',
  LANDS = 'lands',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  MY_STORE = 'my_store',
  ACTIVITY = 'activity'
}

export type Props = {
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = {}
export type MapDispatchProps = {}
