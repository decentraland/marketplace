import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { OrderSortBy } from '@dcl/schemas'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'
import { OwnersTable } from '../OwnersTable'
import { ListingsTable } from '../ListingsTable'
import TableContainer from '../../Table/TableContainer'
import { Props, SortByType } from './ListingsTableContainer.types'
import styles from './ListingsTableContainer.module.css'

const ListingsTableContainer = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { item } = props

    const BelowTabs = {
      LISTINGS: {
        value: 'listings',
        displayValue: t('listings_table.listings')
      },
      OWNERS: {
        value: 'owners',
        displayValue: t('owners_table.owners')
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

    const handleTabChange = useCallback(
      (tab: string) => {
        const sortByTab =
          tab === BelowTabs.LISTINGS.value
            ? OrderSortBy.CHEAPEST
            : OrderDirection.ASC
        setBelowTab(tab)
        setSortBy(sortByTab)
      },
      [BelowTabs.LISTINGS]
    )

    useEffect(() => {
      const params = new URLSearchParams(locations.search)
      if (params.get('selectedTableTab') === BelowTabs.OWNERS.value)
        handleTabChange(BelowTabs.OWNERS.value)
    }, [BelowTabs.OWNERS, handleTabChange, locations.search])

    return (
      <div className={styles.listingsTableContainer}>
        <TableContainer
          children={
            belowTab === BelowTabs.LISTINGS.value ? (
              <ListingsTable asset={item} sortBy={sortBy as OrderSortBy} />
            ) : (
              <OwnersTable
                asset={item}
                orderDirection={sortBy as OrderDirection}
              />
            )
          }
          ref={ref}
          tabsList={[BelowTabs.LISTINGS, BelowTabs.OWNERS]}
          activeTab={belowTab}
          handleTabChange={(tab: string) => handleTabChange(tab)}
          sortbyList={
            belowTab === BelowTabs.LISTINGS.value
              ? listingSortByOptions
              : ownerSortByOptions
          }
          handleSortByChange={(value: string) => setSortBy(value as SortByType)}
          sortBy={sortBy}
        />
      </div>
    )
  }
)

export default React.memo(ListingsTableContainer)
