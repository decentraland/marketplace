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
  ListOfLists,
  DEFAULT_FAVORITES_LIST_ID
} from '../../../modules/vendor/decentraland/favorites'
import { retryParams } from '../../../modules/vendor/decentraland/utils'
import { isErrorWithMessage } from '../../../lib/error'
import { List } from '../../../modules/favorites/types'
import { PrivateTag } from '../../PrivateTag'
import { Props } from './SaveToListModal.types'
import styles from './SaveToListModal.module.css'

export const LISTS_LOADER_DATA_TEST_ID = 'save-to-list-loader'
export const CREATE_LIST_BUTTON_DATA_TEST_ID = 'save-to-list-create-list-button'
const ITEM_HEIGHT = 60
const DEFAULT_LIST_HEIGHT = 300
const DEFAULT_LIST_WIDTH = 650

const SaveToListModal = (props: Props) => {
  const {
    onClose,
    onSavePicks,
    onCreateList,
    isSavingPicks,
    identity,
    metadata: { item }
  } = props

  const [lists, setLists] = useState<{ total: number; data: ListOfLists[] }>({
    total: 0,
    data: []
  })
  const [isLoadingLists, setIsLoadingLists] = useState(false)
  const [error, setError] = useState<string>()
  const [picks, setPicks] = useState<{ pickFor: List[]; unpickFrom: List[] }>({
    pickFor: [],
    unpickFrom: []
  })

  const hasChanges = picks.pickFor.length === 0 && picks.unpickFrom.length === 0

  // TODO: Check if isMobile is required
  const isMobile = false

  const saveButtonMessage = useMemo(() => {
    if (picks.pickFor.length === 1 && picks.unpickFrom.length === 0) {
      return t('save_to_list_modal.save_in_a_list', {
        name: picks.pickFor[0].name
      })
    } else if (picks.pickFor.length === 0 && picks.unpickFrom.length === 1) {
      return t('save_to_list_modal.remove_from_a_list', {
        name: picks.unpickFrom[0].name
      })
    } else if (picks.pickFor.length > 0 && picks.unpickFrom.length === 0) {
      return t('save_to_list_modal.save_in_lists', {
        name: picks.pickFor[0].name,
        count: picks.pickFor.length
      })
    } else if (picks.pickFor.length === 0 && picks.unpickFrom.length > 0) {
      return t('save_to_list_modal.remove_from_lists', {
        name: picks.unpickFrom[0].name,
        count: picks.unpickFrom.length
      })
    } else if (picks.pickFor.length > 0 && picks.unpickFrom.length > 0) {
      return t('save_to_list_modal.save_and_remove_from_lists', {
        count: picks.pickFor.length + picks.unpickFrom.length
      })
    } else {
      return t('save_to_list_modal.save_in_list')
    }
  }, [picks.pickFor, picks.unpickFrom])

  const handleSavePicks = useCallback(() => {
    onSavePicks(picks.pickFor, picks.unpickFrom)
  }, [onSavePicks, picks.pickFor, picks.unpickFrom])

  const handlePickItem = useCallback(
    index => {
      if (lists.data[index].isItemInList) {
        if (picks.unpickFrom.includes(lists.data[index])) {
          setPicks({
            ...picks,
            unpickFrom: picks.unpickFrom.filter(
              list => list.id !== lists.data[index].id
            )
          })
        } else {
          setPicks({
            ...picks,
            unpickFrom: picks.unpickFrom.concat(lists.data[index])
          })
        }
      } else {
        if (picks.pickFor.includes(lists.data[index])) {
          setPicks({
            ...picks,
            pickFor: picks.pickFor.filter(
              list => list.id !== lists.data[index].id
            )
          })
        } else {
          setPicks({
            ...picks,
            pickFor: picks.pickFor.concat(lists.data[index])
          })
        }
      }
    },
    [lists.data, picks]
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
      setIsLoadingLists(true)
      try {
        const result = await favoritesAPI.getLists({
          first: stopIndex - startIndex,
          skip: startIndex,
          itemId: item.id
        })

        // Automatically select the default list
        const defaultList = result.results.find(
          list => list.id === DEFAULT_FAVORITES_LIST_ID
        )
        if (defaultList && !defaultList.isItemInList) {
          setPicks({
            pickFor: picks.pickFor.concat(defaultList),
            unpickFrom: picks.unpickFrom
          })
        }

        setLists({
          data: lists.data.concat(result.results),
          total: result.total
        })
      } catch (error) {
        setError(
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      } finally {
        setIsLoadingLists(false)
      }
    },
    [favoritesAPI, item.id, lists.data, picks.pickFor, picks.unpickFrom]
  )

  const isItemLoaded = useCallback(
    index => {
      const hasNextPage = lists.data.length < lists.total
      return !hasNextPage || index < lists.data.length
    },
    [lists]
  )

  const Row = useCallback(
    ({ index, style }: { index: number; style: object }) => {
      const isPicked =
        (lists.data[index].isItemInList &&
          !picks.unpickFrom.includes(lists.data[index])) ||
        (!lists.data[index].isItemInList &&
          picks.pickFor.includes(lists.data[index]))
      return (
        <div style={style} tabIndex={0}>
          {isItemLoaded(index) ? (
            <div className={styles.listRow}>
              <div className={styles.left}>
                <Checkbox
                  checked={isPicked}
                  disabled={isSavingPicks}
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
      )
    },
    [
      lists.data,
      picks.unpickFrom,
      picks.pickFor,
      isItemLoaded,
      isSavingPicks,
      handlePickItem
    ]
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
      onClose={!isLoadingLists ? onClose : undefined}
    >
      <ModalNavigation
        title={t('save_to_list_modal.title')}
        onClose={!isLoadingLists ? onClose : undefined}
      />
      <Modal.Content className={styles.content}>
        {isLoadingLists && lists.data.length === 0 ? (
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
          disabled={isLoadingLists || isSavingPicks}
          data-testid={CREATE_LIST_BUTTON_DATA_TEST_ID}
          onClick={onCreateList}
        >
          <Icon name="plus" className={styles.icon} />
          {t('save_to_list_modal.create_list')}
        </Button>
        <Button
          primary
          disabled={isLoadingLists || isSavingPicks || hasChanges}
          loading={isSavingPicks}
          onClick={handleSavePicks}
        >
          {saveButtonMessage}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(SaveToListModal)
