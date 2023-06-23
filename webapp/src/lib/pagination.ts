import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PAGE_SIZE } from '../modules/vendor/api'

export type UsePaginationResult = {
  page: number
  pages?: number
  hasMorePages?: boolean
  first: number
  offset: number
  sortBy?: string
  filters: Record<string, string | null>
  goToNextPage: () => void
  goToPage: (newPage: number) => void
  changeSorting: (sort: string) => void
  changeFilter: (
    filter: string,
    value: string,
    clearOldFilters?: boolean
  ) => void
}

export type PaginationOptions = {
  pageSize?: number
  count?: number
}

export function usePagination(
  options?: PaginationOptions
): UsePaginationResult {
  const { search, pathname } = useLocation()
  const { push } = useHistory()
  const pageSize = useMemo(
    () => options?.pageSize?.toString() ?? PAGE_SIZE.toString(),
    [options?.pageSize]
  )
  const filters: Record<string, string | null> = useMemo(() => {
    const params = new URLSearchParams(search)
    params.delete('page')
    params.delete('first')
    params.delete('offset')
    params.delete('sortBy')
    return Object.fromEntries(params.entries())
  }, [search])
  const sortBy =
    useMemo(() => new URLSearchParams(search).get('sortBy'), [search]) ??
    undefined

  const [page, first, offset] = useMemo(() => {
    const params = new URLSearchParams(search)
    const page = parseInt(params.get('page') ?? '1')
    const first = parseInt(params.get('first') ?? pageSize)
    const offset = (page - 1) * first
    return [page, first, offset]
  }, [pageSize, search])

  const goToNextPage = useCallback(() => {
    const params = new URLSearchParams(search)
    params.set('page', (page + 1).toString())
    push(`${pathname}?${params.toString()}`)
  }, [search, page, push, pathname])

  const goToPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(search)
      params.set('page', newPage.toString())
      push(`${pathname}?${params.toString()}`)
    },
    [search, push, pathname]
  )

  const changeSorting = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(search)
      // Reset the page when changing the sorting
      params.set('page', '1')
      params.set('sortBy', sort)
      push(`${pathname}?${params.toString()}`)
    },
    [pathname, push, search]
  )

  const changeFilter = useCallback(
    (filter: string, value: string, clearOldFilters: boolean = false) => {
      const params = new URLSearchParams(clearOldFilters ? {} : search)
      // Reset the page when changing the filter
      params.set('page', '1')
      params.set(filter, value)
      push(`${pathname}?${params.toString()}`)
    },
    [pathname, push, search]
  )

  const pages = options?.count
    ? Math.ceil(options?.count / (options?.pageSize ?? PAGE_SIZE))
    : undefined
  const hasMorePages = pages ? page < pages : undefined

  return {
    page,
    pages,
    hasMorePages,
    first,
    offset,
    sortBy,
    filters,
    goToNextPage,
    goToPage,
    changeSorting,
    changeFilter
  }
}
