import { Avatar } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../modules/asset/types'
import { Item } from '../../../modules/item/types'

export type PreviewProps = {
  asset: Asset
  avatar?: Avatar
  children?: React.ReactNode
  item?: Item | null
  videoHash?: string
  wallet?: Wallet | null
  isDraggable?: boolean
  isLoadingVideoHash?: boolean
  isSoundEnabled?: boolean
  isTryingOn: boolean
  isUnityWearablePreviewEnabled: boolean
  hasBadges?: boolean
  hasSound?: boolean
  onPlaySmartWearableVideoShowcase?: (videoHash: string) => void
  onSetIsTryingOn: (isTryingOn: boolean) => void
  onSetIsSoundEnabled?: (enabled: boolean) => void
}
