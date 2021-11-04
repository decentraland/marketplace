import React from 'react'
import { Table, Loader, TextFilter, Dropdown } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './OnSaleList.types'
import OnSaleListItem from './OnSaleListItem'
import { SortBy } from '../../modules/routing/types'
import styles from './OnSaleList.module.css'

const OnSaleList = ({ items, isLoading, search, count, onSearch }: Props) => {
  const orderBydropdownOptions = [
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ]

  if (isLoading) {
    return (
      <>
        <div className="overlay" />
        <Loader size="massive" active />
      </>
    )
  }

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.search}>
          <TextFilter
            value={search}
            onChange={onSearch}
            placeholder={t('on_sale_list.search', { count })}
          />
        </div>
        <Dropdown
          direction="left"
          value={orderBydropdownOptions[0].value}
          options={orderBydropdownOptions}
          onChange={() => {}}
        />
      </div>
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
            <Table.HeaderCell>{t('global.type')}</Table.HeaderCell>
            <Table.HeaderCell>{t('global.sale_type')}</Table.HeaderCell>
            <Table.HeaderCell>{t('global.sell_price')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item, i) => (
            <OnSaleListItem key={i} {...item} />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default React.memo(OnSaleList)
