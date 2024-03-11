import React, { useEffect, useState } from 'react'
import { Button } from 'decentraland-ui'
import { nftAPI, OwnersFilters, OwnersSortBy } from '../../../modules/vendor/decentraland'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import emptyOwners from '../../../images/emptyOwners.png'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import { formatDataToTable } from './utils'
import { OrderDirection, Props } from './OwnersTable.types'
import styles from './OwnersTable.module.css'

export const ROWS_PER_PAGE = 5
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
      const params: OwnersFilters = {
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
  }, [asset, setIsLoading, setOwners, page, orderDirection])

  return (
    <TableContent
      data={owners}
      activePage={page}
      isLoading={isLoading}
      setPage={setPage}
      totalPages={totalPages}
      empty={() => (
        <div className={styles.emptyTable}>
          <img src={emptyOwners} alt="empty" className={styles.empty} />
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
      hasHeaders
    />
  )
}

export default React.memo(OwnersTable)
