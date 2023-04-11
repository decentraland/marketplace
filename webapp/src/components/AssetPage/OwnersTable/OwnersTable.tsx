import React, { useEffect, useState } from 'react'
import {
  nftAPI,
  OwnersFilters,
  OwnersSortBy
} from '../../../modules/vendor/decentraland'
import { OrderDirection, Props } from './OwnersTable.types'
import { TableContent } from '../../Table/TableContent'
import { formatDataToTable } from './utils'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import styles from './OwnersTable.module.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const OwnersTable = (props: Props) => {
  const { asset, orderDirection = OrderDirection.ASC } = props

  const [owners, setOwners] = useState<DataTableType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (asset && asset.itemId) {
      setIsLoading(true)
      let params: OwnersFilters = {
        contractAddress: asset.contractAddress,
        itemId: asset.itemId,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE,
        sortBy: OwnersSortBy.ISSUED_ID,
        orderDirection
      }
      nftAPI
        .getOwners(params)
        .then(response => {
          setTotal(response.total)
          setOwners(formatDataToTable(response.data, asset))
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setOwners, page, orderDirection, total])

  return (
    <TableContent
      data={owners}
      activePage={page}
      isLoading={isLoading}
      setPage={setPage}
      totalPages={totalPages}
      empty={() => (
        <div className={styles.emptyTable}>
          <span>
            {t('owners_table.there_are_no_owners')}
            <Button
              basic
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={styles.emptyTableActionButton}
            >
              {t('owners_table.become_the_first_one')}
            </Button>
          </span>
        </div>
      )}
      total={total}
    />
  )
}

export default React.memo(OwnersTable)
