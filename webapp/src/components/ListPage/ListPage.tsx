import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
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
import { locations } from '../../modules/routing/locations'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor'
import { View } from '../../modules/ui/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { AssetBrowse } from '../AssetBrowse'
import { PageLayout } from '../PageLayout'
import styles from './ListPage.module.css'
import { Props } from './ListPage.types'
import { timeAgo } from './utils'

const ListPage = ({
  wallet,
  isConnecting,
  listId,
  list,
  isLoading,
  onFetchList,
  onRedirect,
  onBack,
  onEditList,
  onDeleteList,
  onShareList
}: Props) => {
  const hasFetchedOnce = useRef(false)

  // Redirect to signIn if trying to access current account without a wallet
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onRedirect(locations.signIn(`${pathname}${search}`))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting, wallet, onRedirect])

  useEffect(() => {
    hasFetchedOnce.current = false
  }, [listId])

  useEffect(() => {
    if (
      listId &&
      !list &&
      !isLoading &&
      !hasFetchedOnce.current &&
      !isConnecting &&
      wallet
    ) {
      onFetchList(listId)
      hasFetchedOnce.current = true
    }
  }, [list, listId, onFetchList, isLoading, isConnecting, wallet])

  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      {list ? (
        <>
          <Header className={styles.header} size="large">
            <Back onClick={onBack} />
            <div className={styles.nameContainer}>
              {list.name}
              {list.isPrivate && (
                <Badge color="white" className={styles.privateBadge}>
                  <Icon name="lock" />
                  Private
                </Badge>
              )}
            </div>
            <div className={styles.actions}>
              <Button
                className={classNames(styles.iconContainer, styles.share)}
                inverted
                compact
                onClick={onShareList && (() => onShareList(list))}
              >
                <Icon name="share alternate" />
              </Button>
              {/* TODO: should we change the icons to the ones used in the figma? */}
              {/* TODO: When the dropdown is open and I hover an item that overlaps it, the UI becomes weird */}
              <Dropdown
                compact
                className={styles.iconContainer}
                icon={<Icon name="ellipsis horizontal" />}
                as={Button}
                inverted
                tabIndex={999}
              >
                <Dropdown.Menu direction="left">
                  <Dropdown.Item
                    text={t('list_page.edit_list')}
                    onClick={() => onEditList(list)}
                  />
                  <Dropdown.Item
                    text={t('list_page.delete_list')}
                    onClick={() => onDeleteList(list.id)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Header>
          <Header className={styles.header} sub>
            <span className={styles.description}>{list.description}</span>
            {list.updatedAt ? (
              <div className={styles.updatedAt}>
                <b>{t('list_page.last_updated_at')}:</b>{' '}
                {timeAgo(list.updatedAt)}{' '}
              </div>
            ) : null}
          </Header>
          {wallet ? (
            <AssetBrowse
              view={View.LISTS}
              section={Section.LISTS}
              vendor={VendorName.DECENTRALAND}
            />
          ) : (
            <div className={styles.emptyState}></div>
          )}
        </>
      ) : (
        <Loader active size="massive" />
      )}
    </PageLayout>
  )
}

export default React.memo(ListPage)
