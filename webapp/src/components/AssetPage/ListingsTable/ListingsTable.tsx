import React, { useState, useEffect } from 'react'
import { ListingStatus, Network } from '@dcl/schemas'
import { OrderFilters, OrderSortBy } from '@dcl/schemas/dist/dapps/order'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../../modules/asset/utils'
import { orderAPI } from '../../../modules/vendor/decentraland'
import noListings from '../../../images/noListings.png'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import { formatDataToTable } from './utils'
import { Props } from './ListingsTable.types'
import styles from './ListingsTable.module.css'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const ListingsTable = (props: Props) => {
  const { asset, sortBy = OrderSortBy.CHEAPEST, nftToRemove } = props

  const [orders, setOrders] = useState<DataTableType[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number | null>(null)
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

      orderAPI
        .fetchOrders(params, sortBy)
        .then(response => {
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) || 0)
          setOrders(
            formatDataToTable(
              isNFT(asset)
                ? response.data.filter(order => order.tokenId === asset.tokenId)
                : response.data
            )
          )
          setTotal(response.total)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setOrders, sortBy, page, nftToRemove])

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
      hasHeaders
    />
  )
}

export default React.memo(ListingsTable)
