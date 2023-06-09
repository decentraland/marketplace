import React, { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import {
  Back,
  Badge,
  Button,
  Dropdown,
  Header,
  Icon,
  Loader
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatDistanceToNow } from '../../lib/date'
import { locations } from '../../modules/routing/locations'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor'
import { View } from '../../modules/ui/types'
import { DEFAULT_FAVORITES_LIST_ID } from '../../modules/vendor/decentraland/favorites'
import { NavigationTab } from '../Navigation/Navigation.types'
import { AssetBrowse } from '../AssetBrowse'
import { PageLayout } from '../PageLayout'
import styles from './ListPage.module.css'
import { Props } from './ListPage.types'
import {
  ERROR_CONTAINER_TEST_ID,
  COULD_NOT_LOAD_LIST_ACTION_TEST_ID,
  LOADER_TEST_ID,
  LIST_CONTAINER_TEST_ID,
  PRIVATE_BADGE_TEST_ID,
  SHARE_LIST_BUTTON_TEST_ID,
  EDIT_LIST_BUTTON_TEST_ID,
  DELETE_LIST_BUTTON_TEST_ID,
  UPDATED_AT_TEST_ID,
  ASSET_BROWSE_TEST_ID,
  EMPTY_LIST_TEST_ID
} from './constants'

const LIST_NOT_FOUND = 'list was not found'

const ListPage = ({
  wallet,
  listId,
  list,
  isLoading,
  error,
  onFetchList,
  onBack,
  onEditList,
  onDeleteList,
  onShareList
}: Props) => {
  const hasFetchedOnce = useRef(false)

  const fetchList = useCallback(() => {
    if (listId && !isLoading && !hasFetchedOnce.current && wallet) {
      onFetchList(listId)
      hasFetchedOnce.current = true
    }
  }, [listId, isLoading, onFetchList, wallet])

  const handleFetchList = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      hasFetchedOnce.current = false
      fetchList()
    },
    [fetchList]
  )

  const renderErrorView = useCallback(() => {
    const isNotFound = error?.includes(LIST_NOT_FOUND)
    const errorType = isNotFound ? 'not_found' : 'could_not_load'
    return (
      <div
        className={styles.errorContainer}
        data-testid={ERROR_CONTAINER_TEST_ID}
      >
        <div
          className={classNames(
            styles.errorImage,
            isNotFound ? styles.notFoundImage : styles.couldNotLoadImage
          )}
        ></div>
        <h1 className={styles.errorTitle}>
          {t(`list_page.error.${errorType}.title`)}
        </h1>
        <p className={styles.errorSubtitle}>
          {t(`list_page.error.${errorType}.subtitle`)}
        </p>
        {!isNotFound && (
          <Button
            primary
            data-testid={COULD_NOT_LOAD_LIST_ACTION_TEST_ID}
            onClick={handleFetchList}
          >
            {t(`list_page.error.${errorType}.action`)}
          </Button>
        )}
      </div>
    )
  }, [error, handleFetchList])

  useEffect(() => {
    hasFetchedOnce.current = false
  }, [listId])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      {isLoading ? (
        <Loader active size="massive" data-testid={LOADER_TEST_ID} />
      ) : list ? (
        <div data-testid={LIST_CONTAINER_TEST_ID} className={styles.container}>
          <Header className={styles.header} size="large">
            <Back onClick={onBack} />
            <div className={styles.nameContainer}>
              {list.name}
              {list.isPrivate && (
                <div data-testid={PRIVATE_BADGE_TEST_ID}>
                  <Badge color="white" className={styles.privateBadge}>
                    <Icon name="lock" />
                    Private
                  </Badge>
                </div>
              )}
            </div>
            {list.id === DEFAULT_FAVORITES_LIST_ID ? null : (
              <div className={styles.actions}>
                <Button
                  className={classNames(styles.iconContainer, styles.share)}
                  inverted
                  compact
                  onClick={onShareList && (() => onShareList(list))}
                  disabled={list.isPrivate}
                  data-testid={SHARE_LIST_BUTTON_TEST_ID}
                >
                  <Icon name="share alternate" />
                </Button>
                <Dropdown
                  compact
                  className={styles.iconContainer}
                  icon={<Icon name="ellipsis horizontal" />}
                  as={Button}
                  inverted
                >
                  <Dropdown.Menu direction="left">
                    <Dropdown.Item
                      text={t('list_page.edit_list')}
                      onClick={() => onEditList(list)}
                      data-testid={EDIT_LIST_BUTTON_TEST_ID}
                    />
                    <Dropdown.Item
                      text={t('list_page.delete_list')}
                      onClick={() => onDeleteList(list)}
                      data-testid={DELETE_LIST_BUTTON_TEST_ID}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </Header>
          <Header className={styles.header} sub>
            <span className={styles.description}>{list.description}</span>
            {list.updatedAt ? (
              <div
                className={styles.updatedAt}
                data-testid={UPDATED_AT_TEST_ID}
              >
                <b>{t('list_page.last_updated_at')}:</b>{' '}
                {formatDistanceToNow(list.updatedAt, {
                  addSuffix: true,
                  includeSeconds: true
                })}
              </div>
            ) : null}
          </Header>
          {wallet ? (
            <div
              data-testid={ASSET_BROWSE_TEST_ID}
              className={styles.assetBrowseContainer}
            >
              {list.itemsCount ? (
                <AssetBrowse
                  view={View.LISTS}
                  section={Section.LISTS}
                  vendor={VendorName.DECENTRALAND}
                />
              ) : (
                <div className={styles.empty} data-testid={EMPTY_LIST_TEST_ID}>
                  <div className={styles.emptyLogo}></div>
                  <h1>{t('list_page.empty.title')}</h1>
                  <p>{t('list_page.empty.subtitle')}</p>
                  <div className={styles.emptyActions}>
                    <Button primary as={Link} to={locations.browse()}>
                      {t('list_page.empty.action')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        error && renderErrorView()
      )}
    </PageLayout>
  )
}

export default React.memo(ListPage)
