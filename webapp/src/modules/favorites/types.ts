export enum Permission {
  VIEW = 'view',
  EDIT = 'edit'
}

export type FavoritesData = {
  pickedByUser?: boolean
  createdAt?: number
  count: number
}

export type FavoritedItems = { itemId: string; createdAt: number }[]

export type List = {
  id: string
  name: string
  description: string
  userAddress: string
  createdAt: number
  permission?: Permission
}

export declare enum ListsSortBy {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RECENTLY_UPDATED = 'recently_updated'
}

export type ListsFilters = {
  first?: number
  skip?: number
  sortBy?: ListsSortBy
}

export type ListsBrowseOptions = {
  offset?: number
  limit?: number
  filters?: ListsFilters
}
