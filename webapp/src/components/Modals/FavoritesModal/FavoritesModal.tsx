import React, { useCallback, useState, useEffect } from 'react'
import {
  ModalNavigation,
  Message,
  useMobileMediaQuery,
  Empty,
  Loader
} from 'decentraland-ui'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { isErrorWithMessage } from '../../../lib/error'
import { favoritesAPI } from '../../../modules/vendor/decentraland/favorites'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './FavoritesModal.types'
import styles from './FavoritesModal.module.css'

const ITEM_HEIGHT = 55
const DEFAULT_LIST_HEIGHT = 300
const DEFAULT_LIST_WIDTH = 650

const FavoritesModal = ({ metadata: { itemId }, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [favorites, setFavorites] = useState<string[]>([])
  const [total, setTotal] = useState<number>(0)

  const isMobile = useMobileMediaQuery()

  const fetchNextPage = useCallback(
    async (startIndex: number, stopIndex: number) => {
      setIsLoading(true)
      try {
        const result = await favoritesAPI.getWhoFavoritedAnItem(
          itemId,
          stopIndex - startIndex,
          startIndex
        )
        setFavorites(favorites.concat(result.addresses))
        setTotal(result.total)
      } catch (error) {
        setError(isErrorWithMessage(error) ? error.message : 'Unknown')
      } finally {
        setIsLoading(false)
      }
    },
    [itemId, favorites]
  )

  const isItemLoaded = useCallback(
    index => {
      const hasNextPage = favorites.length < total
      return !hasNextPage || index < favorites.length
    },
    [total, favorites]
  )

  const Row = useCallback(
    ({ index, style }: { index: number; style: object }) => (
      <div style={style} tabIndex={0}>
        {isItemLoaded(index) ? (
          <LinkedProfile
            size="huge"
            key={favorites[index]}
            sliceAddressBy={isMobile ? 18 : 40}
            address={favorites[index]}
          />
        ) : (
          'Loading....'
        )}
      </div>
    ),
    [favorites, isItemLoaded, isMobile]
  )

  useEffect(() => {
    fetchNextPage(0, 100)
  }, [fetchNextPage])

  // Makes the modal dynamic in size.
  const desktopHeight =
    favorites.length * ITEM_HEIGHT > 500 ? 500 : favorites.length * ITEM_HEIGHT

  return (
    <Modal
      size="small"
      className={styles.modal}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={t('favorites_modal.title')}
        onClose={!isLoading ? onClose : undefined}
      />
      <Modal.Content className={styles.content}>
        <>
          <div>{t('favorites_modal.disclaimer')}</div>
          {isLoading && favorites.length === 0 ? (
            <div className={styles.loading}>
              <Loader inline size="medium" active />{' '}
              <span>{t('global.loading')}...</span>
            </div>
          ) : null}
          {!isLoading && favorites.length === 0 ? (
            <Empty className={styles.empty}>{t('favorites_modal.empty')}</Empty>
          ) : null}
          {favorites.length !== 0 ? (
            <div
              className={styles.favoritesList}
              style={{ height: !isMobile ? desktopHeight : undefined }}
            >
              <AutoSizer>
                {({ height, width }) => (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={total}
                    loadMoreItems={fetchNextPage}
                  >
                    {({ onItemsRendered, ref }) => (
                      <FixedSizeList
                        itemCount={total}
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
    </Modal>
  )
}

export default React.memo(FavoritesModal)
