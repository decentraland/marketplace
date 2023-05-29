import { ListsSortBy } from '../vendor/decentraland/favorites/types'

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

export type ListsBrowseOptions = {
  page: number
  first: number
  sortBy?: ListsSortBy
}
