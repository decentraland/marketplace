import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, Loader, Dropdown, TextFilter, Pagination } from 'decentraland-ui'
import { CollectionFilters, CollectionSortBy } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { COLLECTIONS_PER_PAGE } from '../../modules/routing/utils'
import { locations } from '../../modules/routing/locations'
import { usePagination } from '../../lib/pagination'
import CollectionImage from '../CollectionImage'
import ListedBadge from '../ListedBadge'
import { Props } from './CollectionList.types'
import styles from './CollectionList.module.css'

const CollectionList = ({ collections, count, creator, isLoading, onFetchCollections }: Props) => {
  const { page, first, offset, pages, sortBy, filters, goToPage, changeSorting, changeFilter } = usePagination<
    keyof CollectionFilters,
    CollectionSortBy
  >({
    pageSize: COLLECTIONS_PER_PAGE,
    count
  })
  const sortOptions = useRef([
    { value: CollectionSortBy.NAME, text: t('filters.name') },
    { value: CollectionSortBy.NEWEST, text: t('filters.newest') },
    {
      value: CollectionSortBy.RECENTLY_REVIEWED,
      text: t('filters.recently_reviewed')
    },
    { value: CollectionSortBy.SIZE, text: t('filters.size') }
  ])

  useEffect(() => {
    onFetchCollections(
      {
        first,
        skip: offset,
        creator,
        sortBy: (sortBy as CollectionSortBy | undefined) ?? CollectionSortBy.NEWEST,
        search: filters.search ?? undefined
      },
      true
    )
  }, [creator, filters.search, first, offset, onFetchCollections, sortBy])

  const search = filters.search ?? ''
  const hasPagination = pages ?? 0 > 1

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.search}>
          <TextFilter
            value={search}
            onChange={newSearch => {
              if (search !== newSearch) {
                changeFilter('search', newSearch)
              }
            }}
            placeholder={t('collection_list.search', {
              count: isLoading ? 0 : count
            })}
          />
        </div>
        <Dropdown
          direction="left"
          value={sortBy}
          defaultValue={CollectionSortBy.NEWEST}
          options={sortOptions.current}
          onChange={(_, data) => {
            if (sortBy !== data.value) {
              changeSorting((data.value?.toString() as CollectionSortBy) ?? '')
            }
          }}
        />
      </div>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active />
        </>
      ) : (
        <>
          {collections.length === 0 ? (
            <div className={styles.empty}>{t('global.no_results')}</div>
          ) : (
            collections.map(collection => (
              <Card key={collection.contractAddress} className={styles.card} fluid>
                <Link className={styles.link} to={locations.collection(collection.contractAddress)}>
                  <Card.Content className={styles.cardContent}>
                    <div className={styles.detailsContainer}>
                      <div className={styles.detailsLeft}>
                        <div className={styles.image}>
                          <CollectionImage contractAddress={collection.contractAddress} />
                        </div>
                      </div>
                      <div className={styles.detailsRight}>
                        <div className={styles.name}>{collection.name}</div>
                        <div className={styles.count}>
                          {t('collection_list.item_count', {
                            count: collection.size
                          })}
                        </div>
                      </div>
                    </div>
                    {collection.isOnSale && <ListedBadge className={styles.listedBadge} />}
                  </Card.Content>
                </Link>
              </Card>
            ))
          )}
          {hasPagination && (
            <div className={styles.pagination}>
              <Pagination
                totalPages={pages ?? 0}
                activePage={page}
                onPageChange={(_, data) => {
                  if (page !== data.activePage) {
                    goToPage(Number(data.activePage))
                  }
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default React.memo(CollectionList)
