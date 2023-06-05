import { SortDirection } from '../../../routing/types'

export type PaginationParameters = {
  first?: number
  skip?: number
}

export type PicksOptions = PaginationParameters

export type ListsOptions = PaginationParameters & {
  sortBy?: ListsSortBy
  sortDirection?: SortDirection
}

export enum ListsSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export enum Permission {
  VIEW = 'view',
  EDIT = 'edit'
}

export type BaseList = {
  id: string
  name: string
  description: string | null
  userAddress: string
  createdAt: number
  updatedAt: number | null
  permission: Permission | null
}

export type ListOfLists = Pick<BaseList, 'id' | 'name'> & {
  itemsCount: number
  isItemInList?: boolean
  previewOfItemIds: string[]
}

export type UpdateOrCreateList = BaseList

export type ListDetails = BaseList & {
  itemsCount: number
}
