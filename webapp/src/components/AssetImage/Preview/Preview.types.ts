import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, IPreviewController } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchSmartWearableVideoHashRequest } from '../../../modules/asset/actions'
import { Asset } from '../../../modules/asset/types'
import { Item } from '../../../modules/item/types'
import { setIsTryingOn, SetIsTryingOnAction } from '../../../modules/ui/preview/actions'

export type Props = {
  asset: Asset
  avatar?: Avatar
  children?: React.ReactNode
  item?: Item | null
  videoHash?: string
  wallet?: Wallet | null
  wearablePreviewController?: IPreviewController | null
  isDraggable?: boolean
  isLoadingVideoHash?: boolean
  isTryingOn?: boolean
  isUnityWearablePreviewEnabled?: boolean
  hasBadges?: boolean
  hasFetchedVideoHash?: boolean
  onSetTryingOn: typeof setIsTryingOn
  onFetchSmartWearableVideoHash: typeof fetchSmartWearableVideoHashRequest
  onPlaySmartWearableVideoShowcase: (videoHash: string) => ReturnType<typeof openModal>
}

export type OwnProps = Pick<Props, 'asset' | 'avatar' | 'children' | 'item' | 'wallet' | 'isDraggable' | 'hasBadges'>

export type MapStateProps = Pick<
  Props,
  'videoHash' | 'wearablePreviewController' | 'isLoadingVideoHash' | 'isTryingOn' | 'isUnityWearablePreviewEnabled' | 'hasFetchedVideoHash'
>

export type MapDispatchProps = Pick<Props, 'onSetTryingOn' | 'onPlaySmartWearableVideoShowcase' | 'onFetchSmartWearableVideoHash'>
export type MapDispatch = Dispatch<
  SetIsTryingOnAction | ReturnType<typeof openModal> | ReturnType<typeof fetchSmartWearableVideoHashRequest>
>
