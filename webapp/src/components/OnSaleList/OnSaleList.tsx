import React, { useRef, useState } from 'react'
import { Table, Loader, TextFilter, Dropdown } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './OnSaleList.types'
import OnSaleListElement from './OnSaleListElement'
import { SortBy } from '../../modules/routing/types'
import styles from './OnSaleList.module.css'
import { useProcessedElements } from './utils'

const OnSaleList = ({ elements, isLoading }: Props) => {
  const sortOptions = useRef([
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ])

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(SortBy.NEWEST)

  const processedElements = useProcessedElements(elements, search, sort)

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
            onChange={setSearch}
            placeholder={t('on_sale_list.search', { count: elements.length })}
          />
        </div>
        <Dropdown
          direction="left"
          value={sort}
          options={sortOptions.current}
          onChange={(_, data) => setSort(data.value as any)}
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
          {processedElements.map(element => (
            <OnSaleListElement
              key={element.item?.id || element.nft!.id}
              {...element}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default React.memo(OnSaleList)
