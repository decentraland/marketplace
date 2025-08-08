import React from 'react'
import { Order, RentalListing, RentalStatus } from '@dcl/schemas'
import { Asset, AssetType } from '../../modules/asset/types'
import { clearItemErrors, fetchItemRequest } from '../../modules/item/actions'
import { clearNFTErrors, fetchNFTRequest } from '../../modules/nft/actions'

export type Props<T extends AssetType = AssetType> = {
  type: T
  contractAddress: string | null
  tokenId: string | null
  asset: Asset<T> | null
  order: Order | null
  rental: RentalListing | null
  isLoading: boolean
  rentalStatus?: RentalStatus[]
  hasLoadedInitialFlags: boolean
  isConnecting: boolean
  isLandOrEstate: boolean
  retry?: boolean
  error: string | null
  withEntity?: boolean
  onFetchNFT: ActionFunction<typeof fetchNFTRequest>
  onFetchItem: ActionFunction<typeof fetchItemRequest>
  onClearErrors: ActionFunction<typeof clearNFTErrors> | ActionFunction<typeof clearItemErrors>
  children: (asset: Asset<T> | null, order: Order | null, rental: RentalListing | null, isLoading: boolean) => React.ReactNode | null
}

export type ContainerProps<T extends AssetType = AssetType> = Pick<
  Props<T>,
  'type' | 'children' | 'rentalStatus' | 'retry' | 'withEntity'
> &
  Partial<Pick<Props, 'contractAddress' | 'tokenId'>>
