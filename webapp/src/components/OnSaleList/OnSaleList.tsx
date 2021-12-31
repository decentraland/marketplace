import React, { useMemo, useRef, useState } from 'react'
import {
  Table,
  Loader,
  TextFilter,
  Dropdown,
  Pagination,
  NotMobile
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './OnSaleList.types'
import OnSaleListElement from './OnSaleListElement'
import { SortBy } from '../../modules/routing/types'
import { useProcessedElements } from './utils'
import styles from './OnSaleList.module.css'

const OnSaleList = ({ elements, isLoading }: Props) => {
  const perPage = useRef(12)
  const sortOptions = useRef([
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ])

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(SortBy.NEWEST)
  const [page, setPage] = useState(1)

  const processedElements = useProcessedElements(
    elements,
    search,
    sort,
    page,
    perPage.current
  )

  const showPagination = processedElements.total / perPage.current > 1

  const searchNode = useMemo(
    () => (
      <TextFilter
        value={search}
        onChange={val => {
          setSearch(val)
          setPage(1)
        }}
        placeholder={t('on_sale_list.search', { count: elements.length })}
      />
    ),
    [elements.length, search]
  )

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.search}>{searchNode}</div>
        <Dropdown
          direction="left"
          value={sort}
          options={sortOptions.current}
          onChange={(_, data) => setSort(data.value as any)}
        />
      </div>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active />
        </>
      ) : (
        <>
          <Table basic="very">
            <NotMobile>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.type')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.sale_type')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.sell_price')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </NotMobile>
            <Table.Body>
              {processedElements.paginated.map(element => (
                <OnSaleListElement
                  key={
                    element.item
                      ? `i-${element.item.id}`
                      : `n-${element.nft!.id}`
                  }
                  {...element}
                />
              ))}
            </Table.Body>
          </Table>
          {processedElements.total === 0 && (
            <div className={styles.empty}>{t('global.no_results')}</div>
          )}
          {showPagination && (
            <div className={styles.pagination}>
              <Pagination
                totalPages={Math.ceil(
                  processedElements.total / perPage.current
                )}
                activePage={page}
                onPageChange={(_, data) => setPage(Number(data.activePage))}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default React.memo(OnSaleList)
