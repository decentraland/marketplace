import React, { useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Dropdown, Tabs } from 'decentraland-ui'

import { OrderDirection } from '../OwnersTable/OwnersTable.types'
import { OwnersTable } from '../OwnersTable'
import { BelowTabs, Props } from './ListingsTableContainer.types'
import styles from './ListingsTableContainer.module.css'

const ListingsTableContainer = ({ item }: Props) => {
  const [belowTab, setBelowTab] = useState(BelowTabs.OWNERS)
  const [orderDirection, setOrderDirection] = useState(OrderDirection.ASC)

  const orderDirectionOptions = [
    {
      text: t('owners_table.issue_number_asc'),
      value: OrderDirection.ASC
    },
    {
      text: t('owners_table.issue_number_desc'),
      value: OrderDirection.DESC
    }
  ]

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filtertabsContainer}>
        <Tabs isFullscreen>
          <Tabs.Tab
            active={belowTab === BelowTabs.LISTINGS}
            onClick={() => setBelowTab(BelowTabs.LISTINGS)}
          >
            <div className={styles.tabStyle}>
              {t('transaction_history.title')}
            </div>
          </Tabs.Tab>
          <Tabs.Tab
            active={belowTab === BelowTabs.OWNERS}
            onClick={() => setBelowTab(BelowTabs.OWNERS)}
          >
            {t('owners_table.owners')}
          </Tabs.Tab>
        </Tabs>
        {belowTab === BelowTabs.OWNERS && (
          <Dropdown
            direction="left"
            className={styles.sortByDropdown}
            value={orderDirection}
            onChange={(_event, data) => {
              const value = data.value as OrderDirection
              setOrderDirection(value)
            }}
            options={orderDirectionOptions}
          />
        )}
      </div>

      {belowTab === BelowTabs.OWNERS && (
        <OwnersTable asset={item} orderDirection={orderDirection} />
      )}
    </div>
  )
}

export default React.memo(ListingsTableContainer)
