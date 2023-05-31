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
