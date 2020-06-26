import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'
import { ENS } from './ens/types'
import { PictureFrame } from './picture_frame/types'
import { View } from '../ui/types'
import { Vendors, NFTsFetchFilters } from '../vendor/types'
import { SortDirection } from '../routing/search'

export enum NFTCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable',
  ENS = 'ens',
  PICTURE_FRAME = 'picture_frame'
}

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
  onlyOnSale: boolean
  search?: string
  filters?: NFTsFetchFilters
}

export type NFTsFetchOptions = {
  vendor: Vendors
  view: View
  params: NFTsFetchParams
}
