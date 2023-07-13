export type Props = {
  isLoadingFeatureFlags: boolean
  isHandsCategoryEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  'isHandsCategoryEnabled' | 'isLoadingFeatureFlags'
>
