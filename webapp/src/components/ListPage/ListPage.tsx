import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, Redirect, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { Back, Button, Dropdown, Header, Icon, Loader, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { formatDistanceToNow } from '../../lib/date'
import { locations } from '../../modules/routing/locations'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor'
import { View } from '../../modules/ui/types'
import { DEFAULT_FAVORITES_LIST_ID } from '../../modules/vendor/decentraland/favorites'
import * as events from '../../utils/events'
import { NavigationTab } from '../Navigation/Navigation.types'
import { AssetBrowse } from '../AssetBrowse'
import { PageLayout } from '../PageLayout'
import { LinkedProfile } from '../LinkedProfile'
import { PrivateTag } from '../PrivateTag'
import { Props } from './ListPage.types'
import styles from './ListPage.module.css'
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
  EMPTY_LIST_TEST_ID,
  GO_BACK_BUTTON_TEST_ID,
  EMPTY_LIST_ACTION_TEST_ID,
  MORE_OPTIONS_DROPDOWN_TEST_ID
} from './constants'

const LIST_NOT_FOUND = 'list was not found'

const ListPage = (props: Props) => {
  const { isConnecting, wallet, listId, list, isLoading, error, onFetchList, onBack, onEditList, onDeleteList, onShareList } = props
  const hasFetchedOnce = useRef(false)
  const { pathname, search } = useLocation()

  const fetchList = useCallback(() => {
    if (listId && !isLoading && !hasFetchedOnce.current) {
      onFetchList(listId)
      hasFetchedOnce.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, isLoading, onFetchList, isConnecting, wallet])

  const handleFetchList = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      hasFetchedOnce.current = false
      fetchList()
    },
    [fetchList]
  )

  const isPublicView = useMemo(
    () => !wallet || (list && wallet.address !== list.userAddress && list.id !== DEFAULT_FAVORITES_LIST_ID),
    [wallet, list]
  )

  const privacyView = isPublicView ? 'public' : 'owner'

  const handleShareList = useCallback(() => {
    if (onShareList && list) {
      getAnalytics().track(events.OPEN_SHARE_LIST_MODAL, {
        list
      })
      onShareList(list)
    }
  }, [onShareList, list])

  const renderErrorView = useCallback(() => {
    const isNotFound = error?.includes(LIST_NOT_FOUND)
    const errorType = isNotFound ? 'not_found' : 'could_not_load'
    return (
      <div className={styles.errorContainer} data-testid={ERROR_CONTAINER_TEST_ID}>
        <div className={classNames(styles.errorImage, isNotFound ? styles.notFoundImage : styles.couldNotLoadImage)}></div>
        <h1 className={styles.errorTitle}>{t(`list_page.error.${errorType}.title`)}</h1>
        <p className={styles.errorSubtitle}>{t(`list_page.error.${errorType}.subtitle`)}</p>
        {!isNotFound && (
          <Button primary data-testid={COULD_NOT_LOAD_LIST_ACTION_TEST_ID} onClick={handleFetchList}>
            {t(`list_page.error.${errorType}.action`)}
          </Button>
        )}
      </div>
    )
  }, [error, handleFetchList])

  useEffect(() => {
    hasFetchedOnce.current = false
  }, [listId, isConnecting])

  useEffect(() => {
    if (!isConnecting) fetchList()
  }, [fetchList, isConnecting])

  if (!isConnecting && !wallet && list?.isPrivate) {
    return <Redirect to={locations.signIn(`${pathname}${search}`)} />
  }

  return (
    <PageLayout activeTab={isPublicView ? undefined : NavigationTab.MY_LISTS}>
      {isLoading || isConnecting ? <Loader active size="massive" data-testid={LOADER_TEST_ID} /> : null}
      {!isLoading && !isConnecting && listId && list && !error ? (
        <div data-testid={LIST_CONTAINER_TEST_ID} className={styles.container}>
          <Header className={styles.header} size="large">
            {!isPublicView || list.id === DEFAULT_FAVORITES_LIST_ID ? (
              <span data-testid={GO_BACK_BUTTON_TEST_ID}>
                <Back onClick={onBack} />
              </span>
            ) : null}
            <div className={styles.nameContainer}>
              {list.name}
              {list.isPrivate && <PrivateTag data-testid={PRIVATE_BADGE_TEST_ID} className={styles.privateBadge} />}
            </div>
            {!isPublicView ? (
              <div className={styles.actions}>
                <Popup
                  content={t('list_page.disable_sharing')}
                  position="top left"
                  trigger={
                    <span>
                      <Button
                        className={classNames(styles.iconContainer, styles.share)}
                        inverted
                        compact
                        onClick={handleShareList}
                        disabled={list.isPrivate}
                        data-testid={SHARE_LIST_BUTTON_TEST_ID}
                      >
                        <Icon name="share alternate" />
                      </Button>
                    </span>
                  }
                  on="hover"
                  disabled={!list.isPrivate}
                />
                <Popup
                  content={t('list_page.disable_kebab_menu')}
                  position="top left"
                  trigger={
                    <span>
                      <Dropdown
                        compact
                        className={styles.iconContainer}
                        icon={<Icon name="ellipsis horizontal" />}
                        as={Button}
                        inverted
                        disabled={list.id === DEFAULT_FAVORITES_LIST_ID}
                        data-testid={MORE_OPTIONS_DROPDOWN_TEST_ID}
                      >
                        <Dropdown.Menu direction="left">
                          <Dropdown.Item
                            text={t('list_page.edit_list')}
                            onClick={() => onEditList(list)}
                            data-testid={EDIT_LIST_BUTTON_TEST_ID}
                            disabled={list.id === DEFAULT_FAVORITES_LIST_ID}
                          />
                          <Dropdown.Item
                            text={t('list_page.delete_list')}
                            onClick={() => onDeleteList(list)}
                            data-testid={DELETE_LIST_BUTTON_TEST_ID}
                            disabled={list.id === DEFAULT_FAVORITES_LIST_ID}
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  }
                  on="hover"
                  disabled={list.id !== DEFAULT_FAVORITES_LIST_ID}
                />
              </div>
            ) : null}
          </Header>
          <Header className={styles.header} sub>
            <div className={styles.subHeaderLeft}>
              <span className={styles.description}>{list.description}</span>
              {isPublicView && list.userAddress && (
                <LinkedProfile data-testid={'linked-profile'} size="large" address={list.userAddress} className={styles.owner} />
              )}
            </div>
            {list.updatedAt ? (
              <div data-testid={UPDATED_AT_TEST_ID}>
                <b>{t('list_page.last_updated_at')}:</b>{' '}
                {formatDistanceToNow(list.updatedAt, {
                  addSuffix: true,
                  includeSeconds: true
                })}
              </div>
            ) : null}
          </Header>
          <div data-testid={ASSET_BROWSE_TEST_ID} className={styles.assetBrowseContainer}>
            {list.itemsCount ? (
              <AssetBrowse view={View.LISTS} section={Section.LISTS} vendor={VendorName.DECENTRALAND} />
            ) : (
              <div className={styles.empty} data-testid={EMPTY_LIST_TEST_ID}>
                <div className={styles.emptyLogo}></div>
                <h1>{t(`list_page.empty.${privacyView}.title`)}</h1>
                <p>{t(`list_page.empty.${privacyView}.subtitle`)}</p>
                {!isPublicView && (
                  <div className={styles.emptyActions}>
                    <Button primary as={Link} to={locations.browse()} data-testid={EMPTY_LIST_ACTION_TEST_ID}>
                      {t(`list_page.empty.${privacyView}.action`)}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
      {!isLoading && !isConnecting && error && renderErrorView()}
    </PageLayout>
  )
}

export default React.memo(ListPage)
