import React, { forwardRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Dropdown, Tabs } from 'decentraland-ui'
import { OrderSortBy } from '@dcl/schemas'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'
import { OwnersTable } from '../OwnersTable'
import ListingsTable from '../ListingsTable/ListingsTable'
import { BelowTabs, Props, SortByType } from './ListingsTableContainer.types'
import styles from './ListingsTableContainer.module.css'

const ListingsTableContainer = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { item } = props
    const locations = useLocation()
    const [belowTab, setBelowTab] = useState(BelowTabs.LISTINGS)
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

    useEffect(() => {
      const params = new URLSearchParams(locations.search)
      if (params.get('selectedTableTab') === BelowTabs.OWNERS)
        handleTabChange(BelowTabs.OWNERS)
    }, [locations.search])

    const handleTabChange = (tab: BelowTabs) => {
      const sortByTab =
        tab === BelowTabs.LISTINGS ? OrderSortBy.CHEAPEST : OrderDirection.ASC
      setBelowTab(tab)
      setSortBy(sortByTab)
    }

    return (
      <div className={styles.tableContainer} ref={ref}>
        <div className={styles.filtertabsContainer}>
          <Tabs isFullscreen>
            <Tabs.Tab
              active={belowTab === BelowTabs.LISTINGS}
              onClick={() => handleTabChange(BelowTabs.LISTINGS)}
            >
              <div className={styles.tabStyle}>
                {t('listings_table.listings')}
              </div>
            </Tabs.Tab>
            <Tabs.Tab
              active={belowTab === BelowTabs.OWNERS}
              onClick={() => handleTabChange(BelowTabs.OWNERS)}
            >
              {t('owners_table.owners')}
            </Tabs.Tab>
          </Tabs>
          <Dropdown
            direction="left"
            className={styles.sortByDropdown}
            value={sortBy}
            onChange={(_event, data) => {
              const value = data.value as SortByType
              setSortBy(value)
            }}
            options={
              belowTab === BelowTabs.LISTINGS
                ? listingSortByOptions
                : ownerSortByOptions
            }
          />
        </div>
        {belowTab === BelowTabs.LISTINGS ? (
          <ListingsTable asset={item} sortBy={sortBy as OrderSortBy} />
        ) : (
          <OwnersTable asset={item} orderDirection={sortBy as OrderDirection} />
        )}
      </div>
    )
  }
)

export default React.memo(ListingsTableContainer)
