import React, { useState } from 'react'
import { BidSortBy } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import TableContainer from '../../Table/TableContainer'
import BidsTableContent from './BidsTableContent/index'
import { Props } from './BidsTable.types'

const BidsTable = ({ asset }: Props) => {
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

  const [sortBy, setSortBy] = useState<BidSortBy>(BidSortBy.MOST_EXPENSIVE)

  return asset ? (
    <TableContainer
      children={<BidsTableContent asset={asset} sortBy={sortBy} />}
      tabsList={tabList}
      sortbyList={sortByList}
      handleSortByChange={(value: string) => setSortBy(value as BidSortBy)}
      sortBy={sortBy}
    />
  ) : null
}

export default React.memo(BidsTable)
