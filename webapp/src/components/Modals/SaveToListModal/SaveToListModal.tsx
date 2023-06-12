import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import {
  Button,
  Checkbox,
  Icon,
  Loader,
  Message,
  ModalNavigation
} from 'decentraland-ui'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  FavoritesAPI,
  MARKETPLACE_FAVORITES_SERVER_URL,
  ListOfLists
} from '../../../modules/vendor/decentraland/favorites'
import { retryParams } from '../../../modules/vendor/decentraland/utils'
import { isErrorWithMessage } from '../../../lib/error'
import { Props } from './SaveToListModal.types'
import styles from './SaveToListModal.module.css'
import { PrivateTag } from '../../PrivateTag'

export const LISTS_LOADER_DATA_TEST_ID = 'save-to-list-loader'
export const CREATE_LIST_BUTTON_DATA_TEST_ID = 'save-to-list-create-list-button'
const ITEM_HEIGHT = 60
const DEFAULT_LIST_HEIGHT = 300
const DEFAULT_LIST_WIDTH = 650

const SaveToListModal = (props: Props) => {
  const {
    onClose,
    onPickItem,
    onUnpickItem,
    onCreateList,
    identity,
    metadata: { item }
  } = props

  const [lists, setLists] = useState<{ total: number; data: ListOfLists[] }>({
    total: 0,
    data: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  // TODO: Check if isMobile is required
  const isMobile = false

  const handlePickItem = useCallback(
    index => {
      if (lists.data[index].isItemInList) {
        onPickItem(lists.data[index].id)
      } else {
        onUnpickItem(lists.data[index].id)
      }
      // Optimistically update the list
      lists.data[index].isItemInList = !lists.data[index].isItemInList
    },
    [lists.data, onPickItem, onUnpickItem]
  )

  const favoritesAPI = useMemo(() => {
    return new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, {
      retries: retryParams.attempts,
      retryDelay: retryParams.delay,
      identity
    })
  }, [identity])

  const fetchNextPage = useCallback(
    async (startIndex: number, stopIndex: number) => {
      setIsLoading(true)
      try {
        const result = await favoritesAPI.getLists({
          first: stopIndex - startIndex,
          skip: startIndex,
          itemId: item.id
        })

        setLists({
          data: lists.data.concat(result.results),
          total: result.total
        })
      } catch (error) {
        setError(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      } finally {
        setIsLoading(false)
      }
    },
    [favoritesAPI, item.id, lists.data]
  )

  const isItemLoaded = useCallback(
    index => {
      const hasNextPage = lists.data.length < lists.total
      return !hasNextPage || index < lists.data.length
    },
    [lists]
  )

  const Row = useCallback(
    ({ index, style }: { index: number; style: object }) => (
      <div style={style} tabIndex={0}>
        {isItemLoaded(index) ? (
          <div className={styles.listRow}>
            <div className={styles.left}>
              <Checkbox
                checked={lists.data[index].isItemInList}
                data-testid={`save-to-list-checkbox-${index}`}
                className={styles.checkbox}
                onChange={() => handlePickItem(index)}
              />
              <div className={styles.listInfo}>
                <div className={styles.name}>{lists.data[index].name}</div>
                <div>
                  {t('save_to_list_modal.items_count', {
                    count: lists.data[index].itemsCount
                  })}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <PrivateTag />
            </div>
          </div>
        ) : (
          t('global.loading')
        )}
      </div>
    ),
    [isItemLoaded, lists.data, handlePickItem]
  )

  useEffect(() => {
    fetchNextPage(0, 24)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Makes the modal dynamic in size.
  const desktopHeight =
    lists.data.length * ITEM_HEIGHT > 500
      ? 500
      : lists.data.length * ITEM_HEIGHT

  return (
    <Modal
      size="tiny"
      className={styles.modal}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={t('save_to_list_modal.title')}
        onClose={!isLoading ? onClose : undefined}
      />
      <Modal.Content className={styles.content}>
        {isLoading && lists.data.length === 0 ? (
          <div
            data-testid={LISTS_LOADER_DATA_TEST_ID}
            className={styles.loading}
          >
            <Loader inline size="medium" active />
            <span>{t('global.loading')}...</span>
          </div>
        ) : null}
        <>
          {lists.data.length !== 0 ? (
            <>
              <div className={styles.separator}></div>
              <div
                className={styles.favoritesList}
                style={{ height: !isMobile ? desktopHeight : undefined }}
              >
                <AutoSizer>
                  {({ height, width }) => (
                    <InfiniteLoader
                      isItemLoaded={isItemLoaded}
                      itemCount={lists.total}
                      loadMoreItems={fetchNextPage}
                    >
                      {({ onItemsRendered, ref }) => (
                        <FixedSizeList
                          itemCount={lists.total}
                          onItemsRendered={onItemsRendered}
                          itemSize={ITEM_HEIGHT}
                          height={height ?? DEFAULT_LIST_HEIGHT}
                          width={width ?? DEFAULT_LIST_WIDTH}
                          ref={ref}
                        >
                          {Row}
                        </FixedSizeList>
                      )}
                    </InfiniteLoader>
                  )}
                </AutoSizer>
              </div>
            </>
          ) : null}
          {error ? (
            <Message
              error
              size="tiny"
              visible
              content={error}
              header={t('global.error')}
            />
          ) : null}
        </>
      </Modal.Content>
      <Modal.Actions>
        <Button
          secondary
          disabled={isLoading}
          data-testid={CREATE_LIST_BUTTON_DATA_TEST_ID}
          loading={isLoading}
          onClick={onCreateList}
        >
          <Icon name="plus" className={styles.icon} />
          {t('save_to_list_modal.create_list')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(SaveToListModal)
