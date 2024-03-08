export type Props = {
  isLoadingFeatureFlags: boolean
  isSmartWearablesFTUEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isSmartWearablesFTUEnabled' | 'isLoadingFeatureFlags'>
