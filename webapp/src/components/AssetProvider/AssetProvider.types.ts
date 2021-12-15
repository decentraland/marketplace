import { Dispatch } from 'redux'
import React from 'react'
import { Order } from '@dcl/schemas'
import {
  fetchNFTRequest,
  FetchNFTRequestAction
} from '../../modules/nft/actions'
import {
  fetchItemRequest,
  FetchItemRequestAction
} from '../../modules/item/actions'
import { Asset, AssetType } from '../../modules/asset/types'

export type Props<T extends AssetType = AssetType> = {
  type: T
  contractAddress: string | null
  tokenId: string | null
  asset: Asset<T> | null
  order: Order | null
  isLoading: boolean
  onFetchNFT: typeof fetchNFTRequest
  onFetchItem: typeof fetchItemRequest
  children: (
    asset: Asset<T> | null,
    order: Order | null,
    isLoading: boolean
  ) => React.ReactNode | null
}

export type MapStateProps = Pick<
  Props,
  'contractAddress' | 'tokenId' | 'asset' | 'order' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFT' | 'onFetchItem'>
export type MapDispatch = Dispatch<
  FetchNFTRequestAction | FetchItemRequestAction
>
export type OwnProps<T extends AssetType = AssetType> = Pick<
  Props<T>,
  'type' | 'children'
> &
  Partial<Pick<Props<T>, 'contractAddress' | 'tokenId'>>
