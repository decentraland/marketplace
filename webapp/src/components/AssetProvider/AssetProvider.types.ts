import { Dispatch } from 'redux'
import React from 'react'
import { Order, RentalListing, RentalStatus } from '@dcl/schemas'
import {
  ClearNFTErrorsAction,
  fetchNFTRequest,
  FetchNFTRequestAction
} from '../../modules/nft/actions'
import {
  ClearItemErrorsAction,
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
  rental: RentalListing | null
  isLoading: boolean
  rentalStatus?: RentalStatus[]
  isLoadingFeatureFlags: boolean
  isConnecting: boolean
  isLandOrEstate: boolean
  retry?: boolean
  error: string | null
  onFetchNFT: typeof fetchNFTRequest
  onFetchItem: typeof fetchItemRequest
  onClearErrors: () => void
  children: (
    asset: Asset<T> | null,
    order: Order | null,
    rental: RentalListing | null,
    isLoading: boolean
  ) => React.ReactNode | null
}

export type MapStateProps = Pick<
  Props,
  | 'contractAddress'
  | 'tokenId'
  | 'asset'
  | 'order'
  | 'rental'
  | 'isLoading'
  | 'isLoadingFeatureFlags'
  | 'isLandOrEstate'
  | 'error'
  | 'isConnecting'
>
export type MapDispatchProps = Pick<
  Props,
  'onFetchNFT' | 'onFetchItem' | 'onClearErrors'
>
export type MapDispatch = Dispatch<
  | FetchNFTRequestAction
  | FetchItemRequestAction
  | ClearNFTErrorsAction
  | ClearItemErrorsAction
>
export type OwnProps<T extends AssetType = AssetType> = Pick<
  Props<T>,
  'type' | 'children' | 'rentalStatus' | 'retry'
> &
  Partial<Pick<Props<T>, 'contractAddress' | 'tokenId'>>
