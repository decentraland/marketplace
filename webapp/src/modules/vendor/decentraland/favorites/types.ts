import { SortDirection } from '../../../routing/types'

export type PaginationParameters = {
  first?: number
  skip?: number
}

export type PicksOptions = PaginationParameters

export type ListsOptions = PaginationParameters & {
  sortBy?: ListsSortBy
  sortDirection?: SortDirection
  itemId?: string
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
  isPrivate: boolean
  permission: Permission | null
  previewOfItemIds: string[]
}

export type ListOfLists = Pick<BaseList, 'id' | 'name' | 'isPrivate' | 'previewOfItemIds'> & {
  itemsCount: number
  isItemInList?: boolean
}

export type UpdateOrCreateList = BaseList

export type ListDetails = BaseList & {
  itemsCount: number
}

export type BulkPickUnpickResponse = {
  pickedByUser: boolean
}
