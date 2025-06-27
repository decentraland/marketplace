import { WearablePreviewProps } from 'decentraland-ui'

export type PortaledWearablePreviewProps = WearablePreviewProps & {
  containerRef?: React.RefObject<HTMLElement>
  isLoadingWearablePreview?: boolean
  isUnityWearablePreviewEnabled: boolean
  hasLoadedInitialFlags: boolean
}

export type MapStateProps = Pick<PortaledWearablePreviewProps, 'isUnityWearablePreviewEnabled' | 'hasLoadedInitialFlags'>
