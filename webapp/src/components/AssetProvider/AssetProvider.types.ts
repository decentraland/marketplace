import React from 'react'
import { Dispatch } from 'redux'
import { Order, RentalListing, RentalStatus } from '@dcl/schemas'
import { Asset, AssetType } from '../../modules/asset/types'
import { ClearItemErrorsAction, FetchItemRequestAction } from '../../modules/item/actions'
import { ClearNFTErrorsAction, FetchNFTRequestAction } from '../../modules/nft/actions'
import { FetchOneOptions } from '../../modules/vendor/types'

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
  withEntity?: boolean
  onFetchNFT: (contractAddress: string, tokenId: string, options?: FetchOneOptions) => unknown
  onFetchItem: (contractAddress: string, tokenId: string) => unknown
  onClearErrors: () => void
  children: (asset: Asset<T> | null, order: Order | null, rental: RentalListing | null, isLoading: boolean) => React.ReactNode | null
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
export type MapDispatchProps = Pick<Props, 'onFetchNFT' | 'onFetchItem' | 'onClearErrors'>
export type MapDispatch = Dispatch<FetchNFTRequestAction | FetchItemRequestAction | ClearNFTErrorsAction | ClearItemErrorsAction>
export type OwnProps<T extends AssetType = AssetType> = Pick<Props<T>, 'type' | 'children' | 'rentalStatus' | 'retry' | 'withEntity'> &
  Partial<Pick<Props<T>, 'contractAddress' | 'tokenId'>>
