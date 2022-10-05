export enum NavigationTab {
  OVERVIEW = 'overview',
  MVMF = 'mvmf',
  LANDS = 'lands',
  BROWSE = 'browse',
  COLLECTIBLES = 'collectibles',
  MY_STORE = 'my_store',
  ACTIVITY = 'activity'
}

export type Props = {
  isMVMFEnabled: boolean
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = Pick<Props, 'isMVMFEnabled'>
export type MapDispatchProps = {}
