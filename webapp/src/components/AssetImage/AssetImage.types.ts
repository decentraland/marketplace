import React from 'react'
import { Dispatch } from 'redux'
import { Avatar, Item, Order, Rarity, Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../modules/asset/types'
import { FetchItemRequestAction, fetchItemRequest } from '../../modules/item/actions'

export type Props = {
  asset: Asset
  avatar?: Avatar
  children?: React.ReactNode
  className?: string
  item: Item | null
  order?: Order
  showOrderListedTag?: boolean
  showUpdatedDateWarning?: boolean
  wallet: Wallet | null
  withNavigation?: boolean
  zoom?: number
  isDraggable?: boolean
  isSmall?: boolean
  hasBadges?: boolean
  hasPopup?: boolean
  onFetchItem: typeof fetchItemRequest
}

export type OwnProps = Pick<Props, 'showOrderListedTag' | 'asset'>

export type MapStateProps = Pick<Props, 'avatar' | 'item' | 'order' | 'wallet'>
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
