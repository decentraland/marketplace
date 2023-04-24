import React, { useState, useEffect } from 'react'
import { ListingStatus, Network } from '@dcl/schemas'
import { OrderFilters, OrderSortBy } from '@dcl/schemas/dist/dapps/order'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { nftAPI, orderAPI } from '../../../modules/vendor/decentraland'
import noListings from '../../../images/noListings.png'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import { formatDataToTable } from './utils'
import { Props } from './ListingsTable.types'
import styles from './ListingsTable.module.css'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const ListingsTable = (props: Props) => {
  const { asset, sortBy = OrderSortBy.CHEAPEST } = props

  const [orders, setOrders] = useState<DataTableType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (asset) {
      setIsLoading(true)

      let params: OrderFilters = {
        contractAddress: asset.contractAddress,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE,
        status: ListingStatus.OPEN
      }

      if (asset.network === Network.MATIC && asset.itemId) {
        params.itemId = asset.itemId
      } else if (asset.network === Network.ETHEREUM) {
        params.nftName = asset.name
      }

      asset.itemId &&
        nftAPI
          .getOwners({
            contractAddress: asset.contractAddress,
            itemId: asset.itemId,
            first: 1,
            skip: 0
          })
          .then(response => {
            setTotal(response.total)
          })
          .finally(() => setIsLoading(false))
          .catch(error => {
            console.error(error)
          })

      orderAPI
        .fetchOrders(params, sortBy)
        .then(response => {
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) || 0)
          setOrders(formatDataToTable(response.data))
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setOrders, sortBy, page])

  return (
    <TableContent
      data={orders}
      isLoading={isLoading}
      setPage={setPage}
      totalPages={totalPages}
      empty={() => (
        <div className={styles.emptyTable}>
          <img src={noListings} alt="empty" />
          <span>{t('listings_table.there_are_no_listings')}</span>
        </div>
      )}
      total={total}
      rowsPerPage={ROWS_PER_PAGE}
      activePage={page}
    />
  )
}

export default React.memo(ListingsTable)
