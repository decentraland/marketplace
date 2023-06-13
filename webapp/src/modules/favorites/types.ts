import { Permission } from '../vendor/decentraland/favorites/types'

export type FavoritesData = {
  pickedByUser?: boolean
  createdAt?: number
  count: number
}

export type FavoritedItems = { itemId: string; createdAt: number }[]

export type CreateListParameters = {
  name: string
  isPrivate: boolean
  description?: string
}

export type UpdateListParameters = Partial<CreateListParameters>

export type List = {
  id: string
  name: string
  itemsCount: number
  isPrivate?: boolean
  description?: string | null
  userAddress?: string
  createdAt?: number
  updatedAt?: number | null
  permission?: Permission | null
  previewOfItemIds?: string[]
}

export type ListBrowseOptions = {}

export enum ListsBrowseSortBy {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RECENTLY_UPDATED = 'updatedAt'
}

export type ListsBrowseOptions = {
  page: number
  first: number
  skip?: number
  sortBy?: ListsBrowseSortBy
}
