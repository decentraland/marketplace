export type Props = {
  isRentalsLaunchPopupEnabled: boolean
  isLoadingFeatureFlags: boolean
}

export type MapStateProps = Pick<
  Props,
  'isRentalsLaunchPopupEnabled' | 'isLoadingFeatureFlags'
>
export type MapDispatchProps = {}
