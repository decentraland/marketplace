import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'
import { ENS } from './ens/types'
import { PictureFrame } from './picture_frame/types'
import { View } from '../ui/types'
import { NFTCategory, NFTsFetchFilters } from '../vendor/nft/types'
import { Vendors } from '../vendor/types'
import { SortDirection } from '../routing/types'

export enum NFTSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  ORDER_CREATED_AT = 'searchOrderCreatedAt',
  PRICE = 'searchOrderPrice'
}

export type NFT = {
  id: string
  contractAddress: string
  tokenId: string
  activeOrderId: string | null
  owner: {
    address: string
  }
  name: string
  category: NFTCategory
  image: string
  url: string
  parcel: Parcel | null
  estate: Estate | null
  wearable: Wearable | null
  ens: ENS | null
  pictureFrame: PictureFrame | null
  vendor: Vendors
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
  vendor: Vendors
  view: View
  params: NFTsFetchParams
  filters?: NFTsFetchFilters
}
