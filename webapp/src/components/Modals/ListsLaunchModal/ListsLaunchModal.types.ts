export type Props = {
  isListsLaunchPopupEnabled: boolean
  isLoadingFeatureFlags: boolean
}

export type MapStateProps = Pick<Props, 'isListsLaunchPopupEnabled' | 'isLoadingFeatureFlags'>
export type MapDispatchProps = {}
