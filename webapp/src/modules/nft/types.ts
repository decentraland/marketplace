import { NFT as BaseNFT, NFTCategory } from '@dcl/schemas'
import { View } from '../ui/types'
import { NFTsFetchFilters } from '../vendor/nft/types'
import { VendorName } from '../vendor/types'
import { SortDirection } from '../routing/types'
import { NFTData as DecentralandData } from '../vendor/decentraland/nft/types'

export enum NFTSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  ORDER_CREATED_AT = 'searchOrderCreatedAt',
  PRICE = 'searchOrderPrice'
}

export type Data<V extends VendorName> = V extends VendorName.DECENTRALAND
  ? DecentralandData
  : V extends void
  ? DecentralandData
  : never

export type NFT<V extends VendorName = VendorName.DECENTRALAND> = Omit<
  BaseNFT,
  'category' | 'data'
> & {
  category: NFTCategory | 'art'
  vendor: VendorName
  data: Data<V>
}

export type NFTsFetchParams = {
  first: number
  skip: number
  orderBy?: NFTSortBy
  orderDirection?: SortDirection
  category?: NFTCategory
  address?: string
  onlyOnSale?: boolean
  search?: string
}

export type NFTsCountParams = Omit<NFTsFetchParams, 'first' | 'skip'>

export type NFTsFetchOptions = {
  vendor: VendorName
  view: View
  params: NFTsFetchParams
  filters?: NFTsFetchFilters
}
