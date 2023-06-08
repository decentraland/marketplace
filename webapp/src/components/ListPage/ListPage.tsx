import React, { useEffect, useRef } from 'react'
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
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor'
import { View } from '../../modules/ui/types'
import { DEFAULT_FAVORITES_LIST_ID } from '../../modules/vendor/decentraland/favorites'
import { NavigationTab } from '../Navigation/Navigation.types'
import { AssetBrowse } from '../AssetBrowse'
import { PageLayout } from '../PageLayout'
import styles from './ListPage.module.css'
import { Props } from './ListPage.types'

export const LOADER_TEST_ID = 'loader'
export const EMPTY_VIEW_TEST_ID = 'empty-view'
export const ASSET_BROWSE_TEST_ID = 'asset-browse'
export const LIST_CONTAINER_TEST_ID = 'list-container'
export const GO_BACK_TEST_ID = 'share-list'
export const PRIVATE_BADGE_TEST_ID = 'private-badge'
export const UPDATED_AT_TEST_ID = 'updated-at'
export const SHARE_LIST_BUTTON_TEST_ID = 'share-list'
export const EDIT_LIST_BUTTON_TEST_ID = 'edit-list'
export const DELETE_LIST_BUTTON_TEST_ID = 'delete-list'

const ListPage = ({
  wallet,
  listId,
  list,
  isLoading,
  onFetchList,
  onBack,
  onEditList,
  onDeleteList,
  onShareList
}: Props) => {
  const hasFetchedOnce = useRef(false)

  useEffect(() => {
    hasFetchedOnce.current = false
  }, [listId])

  useEffect(() => {
    if (listId && !isLoading && !hasFetchedOnce.current && wallet) {
      onFetchList(listId)
      hasFetchedOnce.current = true
    }
  }, [list, listId, onFetchList, isLoading, wallet])

  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      {list ? (
        <div data-testid={LIST_CONTAINER_TEST_ID}>
          <Header className={styles.header} size="large">
            <Back onClick={onBack} data-testid={GO_BACK_TEST_ID} />
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
              <AssetBrowse
                view={View.LISTS}
                section={Section.LISTS}
                vendor={VendorName.DECENTRALAND}
              />
            </div>
          ) : (
            <div
              className={styles.emptyState}
              data-testid={EMPTY_VIEW_TEST_ID}
            ></div>
          )}
        </div>
      ) : (
        <Loader active size="massive" data-testid={LOADER_TEST_ID} />
      )}
    </PageLayout>
  )
}

export default React.memo(ListPage)
