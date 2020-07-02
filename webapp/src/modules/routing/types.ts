import { WearableRarity, WearableGender } from '../nft/wearable/types'
import { Vendors, ContractName, Section } from '../vendor/types'
import { View } from '../ui/types'

export { Section }

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

export type SearchOptions = {
  view?: View
  vendor?: Vendors
  page?: number
  section?: Section
  sortBy?: SortBy
  onlyOnSale?: boolean
  wearableRarities?: WearableRarity[]
  wearableGenders?: WearableGender[]
  search?: string
  contracts?: ContractName[]
  address?: string
}
