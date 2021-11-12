import React, { useRef } from 'react'
import { Card, Loader, Dropdown, TextFilter } from 'decentraland-ui'
import listedSvg from '../../images/listed.svg'
import { Props } from './CollectionList.types'
import styles from './CollectionList.module.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SortBy } from '../../modules/routing/types'

const CollectionList = ({
  collections,
  isLoading,
  search,
  sortBy,
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

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.search}>
          <TextFilter
            value={search}
            onChange={newSearch => {
              if (search !== newSearch) {
                onBrowse({ search: newSearch })
              }
            }}
            placeholder={t('on_sale_list.search', { count: 10 })}
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
        collections.map(collection => (
          <Card key={collection.urn} className={styles.card} fluid>
            <Card.Content className={styles.cardContent}>
              <div className={styles.detailsContainer}>
                <div className={styles.detailsLeft}>
                  <div className={styles.image}></div>
                </div>
                <div className={styles.detailsRight}>
                  <div className={styles.name}>{collection.name}</div>
                  <div className={styles.count}>4 Items</div>
                </div>
              </div>
              {collection.isOnSale && (
                <img className={styles.listed} src={listedSvg} alt="listed" />
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </>
  )
}

export default React.memo(CollectionList)
