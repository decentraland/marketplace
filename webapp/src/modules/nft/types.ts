import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'
import { ENS } from './ens/types'
import { View } from '../ui/types'
import { NFTsFetchFilters } from '../vendor/nft/types'
import { Vendors } from '../vendor/types'
import { SortDirection } from '../routing/types'

export enum NFTSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  ORDER_CREATED_AT = 'searchOrderCreatedAt',
  PRICE = 'searchOrderPrice'
}

export enum NFTCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable',
  ENS = 'ens',
  ART = 'art'
}

// TODO: Move this to their own vendor folders
export type DecentralandNFT = {
  parcel?: Parcel
  estate?: Estate
  wearable?: Wearable
  ens?: ENS
}
export type SuperRareNFT = { description: string }
export type MakersPlaceNFT = { description: string }
export type KnownOriginNFT = { description: string; isEdition: boolean }

export type Data<V extends Vendors> = V extends Vendors.DECENTRALAND
  ? DecentralandNFT
  : V extends Vendors.SUPER_RARE
  ? SuperRareNFT
  : V extends Vendors.MAKERS_PLACE
  ? MakersPlaceNFT
  : V extends Vendors.KNOWN_ORIGIN
  ? KnownOriginNFT
  : V extends void
  ? DecentralandNFT | SuperRareNFT | MakersPlaceNFT | KnownOriginNFT
  : never

export type NFT<V extends Vendors = any> = {
  id: string
  contractAddress: string
  tokenId: string
  activeOrderId: string | null
  owner: string
  name: string
  category: NFTCategory
  image: string
  url: string
  vendor: Vendors
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
  vendor: Vendors
  view: View
  params: NFTsFetchParams
  filters?: NFTsFetchFilters
}
