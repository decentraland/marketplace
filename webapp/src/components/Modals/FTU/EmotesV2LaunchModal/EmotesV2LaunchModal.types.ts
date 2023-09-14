export type Props = {
  isLoadingFeatureFlags: boolean
  isEmotesV2FTUEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  'isEmotesV2FTUEnabled' | 'isLoadingFeatureFlags'
>
