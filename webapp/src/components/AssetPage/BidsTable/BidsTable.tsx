import React, { useEffect, useState } from 'react'
import { Button } from 'decentraland-ui'
import { BidSortBy } from '@dcl/schemas'
import { bidAPI } from '../../../modules/vendor/decentraland'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import emptyOwners from '../../../images/emptyOwners.png'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import TableContainer from '../../Table/TableContainer'
import { formatDataToTable } from './utils'
import { Props } from './BidsTable.types'
import styles from './BidsTable.module.css'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const BidsTable = (props: Props) => {
  const { nft } = props

  const tabList = [
    {
      value: 'offers_table',
      displayValue: t('offers_table.offers')
    }
  ]

  const sortByList = [
    {
      text: t('offers_table.most_expensive'),
      value: BidSortBy.MOST_EXPENSIVE
    },
    {
      text: t('offers_table.recenty_offered'),
      value: BidSortBy.RECENTLY_OFFERED
    },
    {
      text: t('offers_table.recently_updated'),
      value: BidSortBy.RECENTLY_UPDATED
    }
  ]

  const [bids, setBids] = useState<DataTableType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<BidSortBy>(BidSortBy.MOST_EXPENSIVE)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (nft) {
      setIsLoading(true)
      bidAPI
        .fetchByNFT(
          nft.contractAddress,
          nft.tokenId,
          null,
          sortBy,
          ROWS_PER_PAGE.toString(),
          ((page - 1) * ROWS_PER_PAGE).toString()
        )
        .then(response => {
          setTotal(response.total)
          //todo: agarrar el address del usuario
          setBids(formatDataToTable(response.data, '0xaddresss'))
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [nft, setIsLoading, setBids, page, sortBy])

  return (
    <TableContainer
      children={
        <TableContent
          data={bids}
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
      }
      tabsList={tabList}
      sortbyList={sortByList}
      handleSortByChange={(value: string) => setSortBy(value as BidSortBy)}
      sortBy={sortBy}
    />
  )
}

export default React.memo(BidsTable)
