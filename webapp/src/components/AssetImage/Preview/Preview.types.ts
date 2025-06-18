import { Avatar } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchSmartWearableVideoHashRequest } from '../../../modules/asset/actions'
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
  isUnityWearablePreviewEnabled: boolean
  hasBadges?: boolean
  hasFetchedVideoHash?: boolean
  onFetchSmartWearableVideoHash: typeof fetchSmartWearableVideoHashRequest
  onPlaySmartWearableVideoShowcase: (videoHash: string) => ReturnType<typeof openModal>
}
