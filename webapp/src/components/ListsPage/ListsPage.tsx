import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Dropdown, Header, Icon, Loader } from 'decentraland-ui'
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
import { LOADER_TEST_ID, ERROR_TEST_ID, CREATE_LIST_TEST_ID } from './constants'

const ListsPage = ({ count, lists, isLoading, error, onFetchLists, onCreateList }: Props) => {
  const { page, first, sortBy, goToNextPage, changeSorting } = usePagination()
  const selectedSortBy = useMemo(
    () => getParameter<ListsBrowseSortBy>(Object.values(ListsBrowseSortBy), sortBy, ListsBrowseSortBy.RECENTLY_UPDATED),
    [sortBy]
  )

  const fetchLists = useCallback(
    () => {
      let skip: number | undefined = undefined
      let first: number = PAGE_SIZE
      // Check if this is a fresh load of the site trying to load a page that's not the first one
      if (!count && page !== 1) {
        skip = 0
        // Load all pages up to the last one
        first = page * PAGE_SIZE
      }
      onFetchLists({ page, first, skip, sortBy: selectedSortBy })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, onFetchLists, first, selectedSortBy]
  )

  const handleFetchLists = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isLoading) {
        fetchLists()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, fetchLists]
  )

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const handleSortChange = useCallback((_e, data) => changeSorting(data.value), [changeSorting])

  const hasMorePages = lists.length < (count ?? 0)

  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      <div className={styles.content}>
        <Header className={styles.header} size="large">
          {t('lists_page.title')}
        </Header>
        {!error && (
          <>
            <div className={styles.subHeader}>
              <div className={styles.left}>{count ? t('lists_page.subtitle', { count }) : null}</div>
              <div className={styles.right}>
                <span className={styles.sortBy}>{t('filters.sort_by')}</span>
                <Dropdown
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
                    {
                      value: ListsBrowseSortBy.NEWEST,
                      text: t('filters.newest')
                    },
                    {
                      value: ListsBrowseSortBy.OLDEST,
                      text: t('filters.oldest')
                    }
                  ]}
                  value={selectedSortBy}
                  onChange={handleSortChange}
                  className={styles.customDropdown}
                />
                <Button size="small" primary className={styles.createList} onClick={onCreateList} data-testid={CREATE_LIST_TEST_ID}>
                  <Icon name="plus" className={styles.icon} />
                  {t('lists_page.create_list')}
                </Button>
              </div>
            </div>
            {isLoading && lists.length === 0 ? (
              <>
                <div className={styles.overlay} />
                <div className={styles.transparentOverlay}>
                  <Loader active className={styles.loader} data-testid={LOADER_TEST_ID} size="massive" />
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardsGroup}>
                  {lists.map((list, index) => (
                    <ListCard key={`${list.id}-${index}`} list={list} />
                  ))}
                </div>
                <InfiniteScroll page={page} hasMorePages={hasMorePages} onLoadMore={goToNextPage} isLoading={isLoading} maxScrollPages={3}>
                  {null}
                </InfiniteScroll>
              </>
            )}
          </>
        )}
        {error && (
          <div className={styles.errorContainer} data-testid={ERROR_TEST_ID}>
            <div className={styles.errorImage}></div>
            <h1>{t('lists_page.error.title')}</h1>
            <p>{t('lists_page.error.subtitle')}</p>
            <div className={styles.errorActions}>
              <Button primary onClick={handleFetchLists}>
                {t('lists_page.error.action')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default React.memo(ListsPage)
