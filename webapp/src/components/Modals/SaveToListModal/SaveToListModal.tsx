import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { Button, Checkbox, Icon, Loader, Message, ModalNavigation } from 'decentraland-ui'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { FavoritesAPI, MARKETPLACE_FAVORITES_SERVER_URL, ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import { retryParams } from '../../../modules/vendor/decentraland/utils'
import { CreateListParameters } from '../../../modules/favorites/types'
import * as events from '../../../utils/events'
import { isErrorWithMessage } from '../../../lib/error'
import { PrivateTag } from '../../PrivateTag'
import {
  CREATE_LIST_BUTTON_DATA_TEST_ID,
  DEFAULT_LIST_HEIGHT,
  DEFAULT_LIST_WIDTH,
  ITEM_HEIGHT,
  LISTS_LOADER_DATA_TEST_ID,
  LIST_CHECKBOX,
  LIST_ITEMS_COUNT,
  LIST_NAME,
  LIST_PRIVATE,
  SAVE_BUTTON_DATA_TEST_ID
} from './constants'
import { PickType, Props } from './SaveToListModal.types'
import styles from './SaveToListModal.module.css'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'

const SaveToListModal = (props: Props) => {
  const {
    onClose,
    onSavePicks,
    onCreateList,
    isSavingPicks,
    identity,
    onFinishListCreation,
    metadata: { item }
  } = props

  const [lists, setLists] = useState<{ total: number; data: ListOfLists[] }>({
    total: 0,
    data: []
  })
  const [isLoadingLists, setIsLoadingLists] = useState(false)
  const [error, setError] = useState<string>()
  const [picks, setPicks] = useState<{
    pickFor: ListOfLists[]
    unpickFrom: ListOfLists[]
  }>({
    pickFor: [],
    unpickFrom: []
  })

  const hasChanges = picks.pickFor.length === 0 && picks.unpickFrom.length === 0
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
    } else {
      return t('save_to_list_modal.save_changes')
    }
  }, [picks.pickFor, picks.unpickFrom])

  const handleSavePicks = useCallback(() => {
    onSavePicks(picks.pickFor, picks.unpickFrom)
  }, [onSavePicks, picks.pickFor, picks.unpickFrom])

  const handleClose = useCallback(() => (!isLoadingLists ? onClose() : undefined), [isLoadingLists, onClose])

  const addOrRemovePick = useCallback(
    (list: ListOfLists, type: PickType) => {
      if (picks[type].includes(list)) {
        setPicks({
          ...picks,
          [type]: picks[type].filter(l => l.id !== list.id)
        })
      } else {
        setPicks({
          ...picks,
          [type]: picks[type].concat(list)
        })
      }
    },
    [setPicks, picks]
  )

  const handlePickItem = useCallback(
    (index: number) => {
      if (lists.data[index].isItemInList) {
        addOrRemovePick(lists.data[index], PickType.UNPICK_FROM)
      } else {
        addOrRemovePick(lists.data[index], PickType.PICK_FOR)
      }
    },
    [addOrRemovePick, lists.data]
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

        setLists({
          data: lists.data.concat(result.results),
          total: result.total
        })
      } catch (error) {
        setError(isErrorWithMessage(error) ? error.message : t('global.unknown_error'))
      } finally {
        setIsLoadingLists(false)
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

  const createListFunction = useCallback(
    (params: CreateListParameters) => {
      onCreateList({ isLoading: true, onCreateList: createListFunction })
      favoritesAPI
        .createList(params)
        .then(response => {
          const stateLists = [...lists.data]
          stateLists.splice(1, 0, {
            ...response,
            itemsCount: 0,
            previewOfItemIds: []
          })
          setLists({
            total: lists.total++,
            data: stateLists
          })
          getAnalytics().track(events.CREATE_LIST, {
            list: response
          })
          onFinishListCreation()
        })
        .catch(error => {
          const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
          onCreateList({
            isLoading: false,
            onCreateList: createListFunction,
            error: errorMessage
          })
          getAnalytics().track(events.CREATE_LIST, {
            error: errorMessage
          })
        })
    },
    [favoritesAPI, lists.data, lists.total, onCreateList, onFinishListCreation]
  )

  const handleOnCreateListClick = useCallback(() => {
    onCreateList({ onCreateList: createListFunction })
  }, [createListFunction, onCreateList])

  const Row = useCallback(
    ({ index, style }: { index: number; style: object }) => {
      const isPicked =
        (lists.data[index]?.isItemInList && !picks.unpickFrom.includes(lists.data[index])) ||
        (!lists.data[index]?.isItemInList && picks.pickFor.includes(lists.data[index]))
      return (
        <div style={style} tabIndex={0}>
          {isItemLoaded(index) ? (
            <div className={styles.listRow}>
              <div className={styles.left}>
                <Checkbox
                  checked={isPicked}
                  disabled={isSavingPicks}
                  data-testid={LIST_CHECKBOX + lists.data[index].id}
                  className={styles.checkbox}
                  onChange={() => handlePickItem(index)}
                />
                <div className={styles.listInfo}>
                  <div className={styles.name} data-testid={LIST_NAME + lists.data[index].id}>
                    {lists.data[index].name}
                  </div>
                  <div data-testid={LIST_ITEMS_COUNT + lists.data[index].id}>
                    {t('save_to_list_modal.items_count', {
                      count: lists.data[index].itemsCount
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                {lists.data[index].isPrivate ? <PrivateTag data-testid={LIST_PRIVATE + lists.data[index].id} /> : undefined}
              </div>
            </div>
          ) : (
            t('global.loading')
          )}
        </div>
      )
    },
    [lists.data, picks.unpickFrom, picks.pickFor, isItemLoaded, isSavingPicks, handlePickItem]
  )

  useEffect(() => {
    void fetchNextPage(0, 24)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Makes the modal dynamic in size.
  const desktopHeight = lists.data.length * ITEM_HEIGHT > 500 ? 500 : lists.data.length * ITEM_HEIGHT

  return (
    <Modal size="tiny" onClose={handleClose}>
      <ModalNavigation title={t('save_to_list_modal.title')} onClose={handleClose} />
      <Modal.Content>
        {isLoadingLists && lists.data.length === 0 ? (
          <div data-testid={LISTS_LOADER_DATA_TEST_ID} className={styles.loading}>
            <Loader inline size="medium" active />
            <span>{t('global.loading')}...</span>
          </div>
        ) : null}
        <>
          {lists.data.length !== 0 ? (
            <>
              <div className={styles.separator}></div>
              <div className={styles.favoritesList} style={{ height: desktopHeight }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={lists.total} loadMoreItems={fetchNextPage}>
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
          {error ? <Message error size="tiny" visible content={error} header={t('global.error')} /> : null}
        </>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button
          fluid
          secondary
          disabled={isLoadingLists || isSavingPicks}
          data-testid={CREATE_LIST_BUTTON_DATA_TEST_ID}
          onClick={handleOnCreateListClick}
        >
          <Icon name="plus" className={styles.icon} />
          {t('save_to_list_modal.create_list')}
        </Button>
        <Button
          fluid
          primary
          disabled={isLoadingLists || isSavingPicks || hasChanges}
          data-testid={SAVE_BUTTON_DATA_TEST_ID}
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
