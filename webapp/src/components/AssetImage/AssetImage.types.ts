import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, Item, Order, Rarity, Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../modules/asset/types'
import { FetchItemRequestAction, fetchItemRequest } from '../../modules/item/actions'

export type Props = {
  asset: Asset
  order?: Order
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  showUpdatedDateWarning?: boolean
  hasPopup?: boolean
  zoom?: number
  isSmall?: boolean
  avatar?: Avatar
  showOrderListedTag?: boolean
  onFetchItem: typeof fetchItemRequest
  children?: React.ReactNode
  hasBadges?: boolean
  item: Item | null
  wallet: Wallet | null
}

export type OwnProps = Pick<Props, 'showOrderListedTag' | 'asset'>

export type MapStateProps = Pick<Props, 'order' | 'avatar' | 'item' | 'wallet'>
export type MapDispatchProps = Pick<Props, 'onFetchItem'>
export type MapDispatch = Dispatch<FetchItemRequestAction>

export type AvailableForMintPopupType = {
  price: string
  stock: number
  rarity: Rarity
  contractAddress: string
  itemId: string
  network: Network
}
