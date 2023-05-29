export type PaginationParameters = {
  first?: number
  skip?: number
}

export type PicksOptions = PaginationParameters

export type ListsOptions = PaginationParameters & {
  sortBy?: ListsSortBy
}

export declare enum ListsSortBy {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RECENTLY_UPDATED = 'recently_updated'
}
