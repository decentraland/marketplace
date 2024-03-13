import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PAGE_SIZE } from '../modules/vendor/api'

export type UsePaginationResult<T extends string, S extends string> = {
  page: number
  pages?: number
  hasMorePages?: boolean
  first: number
  offset: number
  sortBy?: S
  filters: Record<T, string | null>
  goToNextPage: () => void
  goToPage: (newPage: number) => void
  changeSorting: (sort: S) => void
  changeFilter: (filter: T, value: string, options?: { clearOldFilters: boolean }) => void
}

export type PaginationOptions = {
  pageSize?: number
  count?: number
}

export function usePagination<T extends string = string, S extends string = string>(
  options?: PaginationOptions
): UsePaginationResult<T, S> {
  const { search, pathname } = useLocation()
  const history = useHistory()
  const push = history.push.bind(history)
  const pageSize = useMemo(() => options?.pageSize?.toString() ?? PAGE_SIZE.toString(), [options?.pageSize])
  const filters: Record<T, string | null> = useMemo(() => {
    const params = new URLSearchParams(search)
    params.delete('page')
    params.delete('first')
    params.delete('offset')
    params.delete('sortBy')
    return Object.fromEntries(params.entries()) as Record<T, string | null>
  }, [search])
  const sortBy = (useMemo(() => new URLSearchParams(search).get('sortBy'), [search]) as S) ?? undefined

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
    (sort: S) => {
      const params = new URLSearchParams(search)
      // Reset the page when changing the sorting
      params.set('page', '1')
      params.set('sortBy', sort)
      push(`${pathname}?${params.toString()}`)
    },
    [pathname, push, search]
  )

  const changeFilter = useCallback(
    (filter: string, value: string, options: { clearOldFilters: boolean } = { clearOldFilters: false }) => {
      const params = new URLSearchParams(options.clearOldFilters ? {} : search)
      // Reset the page when changing the filter
      params.set('page', '1')
      if (options.clearOldFilters && sortBy) {
        params.set('sortBy', sortBy)
      }
      params.set(filter, value)
      push(`${pathname}?${params.toString()}`)
    },
    [pathname, push, search, sortBy]
  )

  const pages = options?.count ? Math.ceil(options?.count / (options?.pageSize ?? PAGE_SIZE)) : undefined
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
