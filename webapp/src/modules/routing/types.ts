import { Network, Rarity } from '@dcl/schemas'
import { Item } from '@dcl/schemas'
import { VendorName } from '../vendor/types'
import { Section } from '../vendor/routing/types'
import { View } from '../ui/types'
import { NFT } from '..//nft/types'
import { WearableGender } from '../nft/wearable/types'

export { Section } from '../vendor/routing/types'

export enum SortBy {
  NAME = 'name',
  NEWEST = 'newest',
  RECENTLY_LISTED = 'recently_listed',
  CHEAPEST = 'cheapest'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type NFTBrowseOptions = {
  resultType?: ResultType
  view?: View
  vendor?: VendorName
  page?: number
  section?: Section
  sortBy?: SortBy
  onlyOnSale?: boolean
  isMap?: boolean
  isFullscreen?: boolean
  wearableRarities?: Rarity[]
  wearableGenders?: WearableGender[]
  search?: string
  contracts?: string[]
  address?: string
  network?: Network
}

// TODO: Rename this to ASSET_TYPE and move it to an asset module
export type Asset<T extends ResultType = ResultType> = T extends ResultType.NFT
  ? NFT
  : T extends ResultType.ITEM
  ? Item
  : NFT | Item

// TODO: Rename this to ASSET_TYPE and move it to an asset module
export enum ResultType {
  ITEM = 'item',
  NFT = 'nft'
}
