import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Dropdown, Header, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { usePagination } from '../../lib/pagination'
import { ListsBrowseSortBy } from '../../modules/favorites/types'
import { PAGE_SIZE } from '../../modules/vendor/api'
import { getParameter } from '../../lib/enum'
import { InfiniteScroll } from '../InfiniteScroll'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { ListCard } from './ListCard'
import { Props } from './ListsPage.types'
import styles from './ListsPage.module.css'

const ListsPage = ({
  count,
  lists,
  isLoading,
  onFetchLists,
  onCreateList
}: Props) => {
  const { page, first, sortBy, goToNextPage, changeSorting } = usePagination()
  const selectedSortBy = useMemo(
    () =>
      getParameter<ListsBrowseSortBy>(
        Object.values(ListsBrowseSortBy),
        sortBy,
        ListsBrowseSortBy.RECENTLY_UPDATED
      ),
    [sortBy]
  )

  useEffect(() => {
    let skip: number | undefined = undefined
    let first: number = PAGE_SIZE
    // Check if this is a fresh load of the site trying to load a page that's not the first one
    if (!count && page !== 1) {
      skip = 0
      // Load all pages up to the last one
      first = page * PAGE_SIZE
    }
    onFetchLists({ page, first, skip, sortBy: selectedSortBy })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first, page, selectedSortBy, onFetchLists])

  const handleSortChange = useCallback(
    (_e, data) => changeSorting(data.value),
    [changeSorting]
  )

  const hasMorePages = lists.length < (count ?? 0)

  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      <Header className={styles.header} size="large">
        {t('lists_page.title')}
      </Header>
      <div className={styles.subHeader}>
        <div className={styles.left}>
          {count ? t('lists_page.subtitle', { count }) : null}
        </div>
        <div className={styles.right}>
          <span className={styles.sortBy}>{t('filters.sort_by')}</span>
          <Dropdown
            pointing="top right"
            options={[
              {
                value: ListsBrowseSortBy.RECENTLY_UPDATED,
                text: t('filters.recently_updated')
              },
              {
                value: ListsBrowseSortBy.NAME_ASC,
                text: t('filters.name_asc')
              },
              {
                value: ListsBrowseSortBy.NAME_DESC,
                text: t('filters.name_desc')
              },
              { value: ListsBrowseSortBy.NEWEST, text: t('filters.newest') },
              { value: ListsBrowseSortBy.OLDEST, text: t('filters.oldest') }
            ]}
            value={selectedSortBy}
            onChange={handleSortChange}
          />
          <Button
            size="small"
            primary
            className={styles.createList}
            onClick={onCreateList}
          >
            <Icon name="plus" className={styles.icon} />
            {t('lists_page.create_list')}
          </Button>
        </div>
      </div>
      <InfiniteScroll
        page={page}
        hasMorePages={hasMorePages}
        onLoadMore={goToNextPage}
        isLoading={isLoading}
        maxScrollPages={3}
      >
        <div className={styles.cardsGroup}>
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </InfiniteScroll>
    </PageLayout>
  )
}

export default React.memo(ListsPage)
