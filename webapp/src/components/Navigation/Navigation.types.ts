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
  isMVMFTabEnabled: boolean
  isFullScreen?: boolean
  activeTab?: NavigationTab
  isFullscreen?: boolean
}

export type MapStateProps = Pick<Props, 'isMVMFTabEnabled' | 'isFullScreen'>
export type MapDispatchProps = {}
