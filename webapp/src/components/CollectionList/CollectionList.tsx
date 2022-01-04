import React, { useRef } from 'react'
import { Card, Loader, Dropdown, TextFilter, Pagination } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './CollectionList.types'
import { SortBy } from '../../modules/routing/types'
import { COLLECTIONS_PER_PAGE } from '../../modules/routing/utils'
import CollectionImage from '../CollectionImage'
import { locations } from '../../modules/routing/locations'
import styles from './CollectionList.module.css'
import ListedBadge from '../ListedBadge'

const CollectionList = ({
  collections,
  count,
  isLoading,
  search,
  sortBy,
  page,
  onBrowse
}: Props) => {
  const sortOptions = useRef([
    { value: SortBy.NAME, text: t('filters.name') },
    { value: SortBy.NEWEST, text: t('filters.newest') },
    {
      value: SortBy.RECENTLY_REVIEWED,
      text: t('filters.recently_reviewed')
    },
    { value: SortBy.SIZE, text: t('filters.size') }
  ])

  const pages = Math.ceil(count / COLLECTIONS_PER_PAGE)

  const hasPagination = pages > 1

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.search}>
          <TextFilter
            value={search}
            onChange={newSearch => {
              if (search !== newSearch) {
                onBrowse({ search: newSearch, page: 1 })
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
          options={sortOptions.current}
          onChange={(_, data) => {
            if (sortBy !== data.value) {
              onBrowse({ sortBy: data.value as SortBy })
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
              <Card className={styles.card} fluid>
                <Link
                  className={styles.link}
                  key={collection.contractAddress}
                  to={locations.collection(collection.contractAddress)}
                >
                  <Card.Content className={styles.cardContent}>
                    <div className={styles.detailsContainer}>
                      <div className={styles.detailsLeft}>
                        <div className={styles.image}>
                          <CollectionImage
                            contractAddress={collection.contractAddress}
                          />
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
                    {collection.isOnSale && (
                      <ListedBadge className={styles.listedBadge} />
                    )}
                  </Card.Content>
                </Link>
              </Card>
            ))
          )}
          {hasPagination && (
            <div className={styles.pagination}>
              <Pagination
                totalPages={pages}
                activePage={page}
                onPageChange={(_, data) => {
                  if (page !== data.activePage) {
                    onBrowse({ page: Number(data.activePage) })
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
