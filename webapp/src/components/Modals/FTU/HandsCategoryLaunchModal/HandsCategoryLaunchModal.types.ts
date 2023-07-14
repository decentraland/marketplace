export type Props = {
  isLoadingFeatureFlags: boolean
  isHandsCategoryFTUEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  'isHandsCategoryFTUEnabled' | 'isLoadingFeatureFlags'
>
