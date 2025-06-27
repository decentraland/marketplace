import React from 'react'
import { Dispatch } from 'redux'
import { Avatar } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchSmartWearableVideoHashRequest } from '../../../modules/asset/actions'
import { Asset } from '../../../modules/asset/types'
import { Item } from '../../../modules/item/types'
import { setPortalPreviewProps, SetPortalPreviewPropsAction } from '../../../modules/ui/preview/actions'

export type Props = {
  asset: Asset
  avatar?: Avatar
  children?: React.ReactNode
  item?: Item | null
  videoHash?: string
  wallet?: Wallet | null
  isDraggable?: boolean
  isLoadingVideoHash?: boolean
  hasBadges?: boolean
  hasFetchedVideoHash?: boolean
  onFetchSmartWearableVideoHash: typeof fetchSmartWearableVideoHashRequest
  onPlaySmartWearableVideoShowcase: (videoHash: string) => ReturnType<typeof openModal>
  onSetPortalPreviewProps: typeof setPortalPreviewProps
}

export type OwnProps = Pick<Props, 'asset' | 'avatar' | 'children' | 'item' | 'wallet' | 'isDraggable' | 'isLoadingVideoHash' | 'hasBadges'>

export type MapStateProps = Pick<Props, 'videoHash' | 'isLoadingVideoHash' | 'hasFetchedVideoHash'>

export type MapDispatchProps = Pick<Props, 'onSetPortalPreviewProps' | 'onPlaySmartWearableVideoShowcase' | 'onFetchSmartWearableVideoHash'>
export type MapDispatch = Dispatch<
  SetPortalPreviewPropsAction | ReturnType<typeof openModal> | ReturnType<typeof fetchSmartWearableVideoHashRequest>
>
