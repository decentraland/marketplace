import { RefObject } from 'react'
import { WearablePreviewProps } from 'decentraland-ui'

export type PortalWearablePreviewProps = {
  containerRef?: RefObject<HTMLElement>
  isLoadingWearablePreview?: boolean
  isUnityWearablePreviewEnabled: boolean
  hasLoadedInitialFlags: boolean
} & WearablePreviewProps

export type MapStateProps = Pick<PortalWearablePreviewProps, 'isUnityWearablePreviewEnabled' | 'hasLoadedInitialFlags'>
