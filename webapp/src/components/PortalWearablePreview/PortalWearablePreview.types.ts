import { RefObject } from 'react'
import { WearablePreviewProps } from 'decentraland-ui'
import { setWearablePreviewController } from '../../modules/ui/preview/actions'

export type PortalWearablePreviewProps = WearablePreviewProps & {
  containerRef?: RefObject<HTMLElement>
  isLoadingWearablePreview?: boolean
  isUnityWearablePreviewEnabled: boolean
  hasLoadedInitialFlags: boolean
  onSetWearablePreviewController: typeof setWearablePreviewController
}

export type MapStateProps = Pick<PortalWearablePreviewProps, 'isUnityWearablePreviewEnabled' | 'hasLoadedInitialFlags'>
export type MapDispatchProps = Pick<PortalWearablePreviewProps, 'onSetWearablePreviewController'>
