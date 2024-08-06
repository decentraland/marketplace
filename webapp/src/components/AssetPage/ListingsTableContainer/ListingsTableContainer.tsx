import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BidSortBy, OrderSortBy } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import TableContainer from '../../Table/TableContainer'
import BidsTableContent from '../BidsTable/BidsTableContent'
import { ListingsTable } from '../ListingsTable'
import { OwnersTable } from '../OwnersTable'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'
import { Props, SortByType } from './ListingsTableContainer.types'
import styles from './ListingsTableContainer.module.css'

const ListingsTableContainer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { item } = props

  const BelowTabs = {
    LISTINGS: {
      value: 'listings',
      displayValue: t('listings_table.listings')
    },
    OWNERS: {
      value: 'owners',
      displayValue: t('owners_table.owners')
    },
    BIDS: {
      value: 'bids',
      displayValue: t('bids_table.bids')
    }
  }

  const locations = useLocation()
  const [belowTab, setBelowTab] = useState(BelowTabs.LISTINGS.value)
  const [sortBy, setSortBy] = useState<SortByType>(OrderSortBy.CHEAPEST)

  const ownerSortByOptions = [
    {
      text: t('owners_table.issue_number_asc'),
      value: OrderDirection.ASC
    },
    {
      text: t('owners_table.issue_number_desc'),
      value: OrderDirection.DESC
    }
  ]

  const listingSortByOptions = [
    {
      text: t('listings_table.cheapest'),
      value: OrderSortBy.CHEAPEST
    },
    {
      text: t('listings_table.newest'),
      value: OrderSortBy.RECENTLY_LISTED
    },
    {
      text: t('listings_table.oldest'),
      value: OrderSortBy.OLDEST
    },
    {
      text: t('listings_table.issue_number_asc'),
      value: OrderSortBy.ISSUED_ID_ASC
    },
    {
      text: t('listings_table.issue_number_desc'),
      value: OrderSortBy.ISSUED_ID_DESC
    }
  ]

  const bidsSortByOptions = [
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

  const getDefaultSortBy = useCallback((tab: string) => {
    switch (tab) {
      case BelowTabs.LISTINGS.value:
        return OrderSortBy.CHEAPEST
      case BelowTabs.OWNERS.value:
        return OrderDirection.ASC
      case BelowTabs.BIDS.value:
        return BidSortBy.MOST_EXPENSIVE
      default:
        return OrderSortBy.CHEAPEST
    }
  }, [])

  const handleTabChange = useCallback(
    (tab: string) => {
      setBelowTab(tab)
      setSortBy(getDefaultSortBy(tab))
    },
    [BelowTabs.LISTINGS]
  )

  useEffect(() => {
    const params = new URLSearchParams(locations.search)
    if (params.get('selectedTableTab') === BelowTabs.OWNERS.value) handleTabChange(BelowTabs.OWNERS.value)
  }, [BelowTabs.OWNERS, handleTabChange, locations.search])

  const tableContent = useMemo(() => {
    switch (belowTab) {
      case BelowTabs.LISTINGS.value:
        return <ListingsTable asset={item} sortBy={sortBy as OrderSortBy} />
      case BelowTabs.OWNERS.value:
        return <OwnersTable asset={item} orderDirection={sortBy as OrderDirection} />
      case BelowTabs.BIDS.value:
        return <BidsTableContent asset={item} sortBy={sortBy as BidSortBy} />
      default:
        return null
    }
  }, [belowTab, item, sortBy])

  const sortByList = useMemo(() => {
    switch (belowTab) {
      case BelowTabs.LISTINGS.value:
        return listingSortByOptions
      case BelowTabs.OWNERS.value:
        return ownerSortByOptions
      case BelowTabs.BIDS.value:
        return bidsSortByOptions
      default:
        return []
    }
  }, [belowTab])

  return (
    <div className={styles.listingsTableContainer}>
      <TableContainer
        children={tableContent}
        ref={ref}
        tabsList={[BelowTabs.LISTINGS, BelowTabs.OWNERS, BelowTabs.BIDS]}
        activeTab={belowTab}
        handleTabChange={(tab: string) => handleTabChange(tab)}
        sortbyList={sortByList}
        handleSortByChange={(value: string) => setSortBy(value as SortByType)}
        sortBy={sortBy}
      />
    </div>
  )
})

export default React.memo(ListingsTableContainer)
