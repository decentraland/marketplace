import React, { useState, useEffect } from 'react'
import { RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { rentalsAPI } from '../../../modules/vendor/decentraland/rentals/api'
import TableContainer from '../../Table/TableContainer'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import { formatDataToTable } from './utils'
import { Props } from './RentalHistory.types'

const ROWS_PER_PAGE = 12

const RentalHistory = (props: Props) => {
  const { asset } = props

  const tabList = [{ value: 'rental_history', displayValue: t('rental_history.title') }]

  const [rentals, setRentals] = useState<DataTableType[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    let cancel = false
    if (asset) {
      rentalsAPI
        .getRentalListings({
          contractAddresses: [asset.contractAddress],
          tokenId: asset.tokenId,
          status: [RentalStatus.EXECUTED, RentalStatus.CLAIMED],
          limit: ROWS_PER_PAGE,
          page: (page - 1) * ROWS_PER_PAGE
        })
        .then(response => {
          if (cancel) return
          setTotal(response.total)
          setRentals(formatDataToTable(response.results))
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => !cancel && setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
    return () => {
      cancel = true
    }
  }, [asset, setIsLoading, setRentals, page])

  return rentals.length > 0 ? (
    <TableContainer
      tabsList={tabList}
      children={
        <TableContent
          data={rentals}
          activePage={page}
          isLoading={isLoading}
          setPage={setPage}
          totalPages={totalPages}
          empty={() => null}
          total={total}
          rowsPerPage={ROWS_PER_PAGE}
        />
      }
    />
  ) : null
}

export default React.memo(RentalHistory)
