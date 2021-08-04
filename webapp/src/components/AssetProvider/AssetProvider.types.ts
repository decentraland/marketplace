import { Dispatch } from 'redux'
import React from 'react'
import {
  fetchNFTRequest,
  FetchNFTRequestAction
} from '../../modules/nft/actions'
import {
  fetchItemRequest,
  FetchItemRequestAction
} from '../../modules/item/actions'
import { Order } from '../../modules/order/types'
import { Asset } from '../../modules/routing/types'
import { ResultType } from '../../modules/asset/types'

export type Props<T extends ResultType = ResultType> = {
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
export type OwnProps<T extends ResultType = ResultType> = Pick<
  Props<T>,
  'type' | 'children'
> &
  Partial<Pick<Props<T>, 'contractAddress' | 'tokenId'>>
