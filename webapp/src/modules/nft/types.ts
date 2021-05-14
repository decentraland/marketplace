import { ChainId, Network } from '@dcl/schemas'
import { Parcel } from './parcel/types'
import { Estate } from './estate/types'
import { Wearable } from './wearable/types'
import { ENS } from './ens/types'
import { View } from '../ui/types'
import { NFTsFetchFilters } from '../vendor/nft/types'
import { VendorName } from '../vendor/types'
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

export type Data<V extends VendorName> = V extends VendorName.DECENTRALAND
  ? DecentralandNFT
  : V extends VendorName.SUPER_RARE
  ? SuperRareNFT
  : V extends VendorName.MAKERS_PLACE
  ? MakersPlaceNFT
  : V extends VendorName.KNOWN_ORIGIN
  ? KnownOriginNFT
  : V extends void
  ? DecentralandNFT | SuperRareNFT | MakersPlaceNFT | KnownOriginNFT
  : never

export type NFT<V extends VendorName = any> = {
  id: string
  contractAddress: string
  tokenId: string
  activeOrderId: string | null
  owner: string
  name: string
  category: NFTCategory
  image: string
  url: string
  vendor: VendorName
  network: Network
  chainId: ChainId
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
