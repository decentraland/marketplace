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
import styles from './SaveToListModal.module.css'
import { Props } from './SaveToListModal.types'

export const LISTS_LOADER_DATA_TEST_ID = 'save-to-list-loader'
export const CREATE_LIST_BUTTON_DATA_TEST_ID = 'save-to-list-create-list-button'
const ITEM_HEIGHT = 55
const DEFAULT_LIST_HEIGHT = 300
const DEFAULT_LIST_WIDTH = 650

const SaveToListModal = (props: Props) => {
  const {
    onClose,
    onPickItem,
    onUnpickItem,
    onCreateList,
    metadata: { itemId }
  } = props

  const [lists, setLists] = useState<{ total: number; data: ListOfLists[] }>({
    total: 0,
    data: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  // TODO: Check if isMobile is required
  const isMobile = false

  const handleCreateList = useCallback(
    itemId => {
      onCreateList(itemId)
    },
    [onCreateList]
  )
  const handlePickItem = useCallback(
    index => {
      if (lists.data[index].isItemInList) {
        onPickItem(itemId, lists.data[index].id)
      } else {
        onUnpickItem(itemId, lists.data[index].id)
      }
      // Optimistically update the list
      lists.data[index].isItemInList = !lists.data[index].isItemInList
    },
    [itemId, lists.data, onPickItem, onUnpickItem]
  )

  const favoritesAPI = useMemo(() => {
    return new FavoritesAPI(MARKETPLACE_FAVORITES_SERVER_URL, {
      retries: retryParams.attempts,
      retryDelay: retryParams.delay
    })
  }, [])

  const fetchNextPage = useCallback(
    async (startIndex: number, stopIndex: number) => {
      setIsLoading(true)
      try {
        const result = await favoritesAPI.getLists({
          first: stopIndex - startIndex,
          skip: startIndex,
          itemId
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
    [favoritesAPI, itemId, lists.data]
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
            <span>
              <Checkbox
                checked={lists.data[index].isItemInList}
                data-testid={`save-to-list-checkbox-${index}`}
                className={styles.checkbox}
                onChange={() => handlePickItem(index)}
              />
              <div className={styles.listInfo}>
                <span>{lists.data[index].name}</span>
                <span>
                  {t('save-to-list-items-count', {
                    count: lists.data[index].itemsCount
                  })}
                </span>
              </div>
            </span>
          </div>
        ) : (
          'Loading....'
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
      size="small"
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
          onClick={handleCreateList}
        >
          <Icon name="plus" className={styles.icon} />
          {t('save-to-list-create-list')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(SaveToListModal)
