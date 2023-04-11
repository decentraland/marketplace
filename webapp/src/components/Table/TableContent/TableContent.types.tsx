import React from 'react'

export type Props = {
  activePage?: number
  data: DataTableType[]
  isLoading: boolean
  setPage?: (page: number) => void
  totalPages?: number
  empty: () => void
  total: number
  rowsPerPage?: number
}

export type DataTableType = {
  [key: string]: React.ReactNode
}
