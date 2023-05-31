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
