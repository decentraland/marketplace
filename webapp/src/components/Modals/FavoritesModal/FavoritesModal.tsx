import React, { useCallback, useEffect, useState } from 'react'
import { ModalNavigation, Message, useMobileMediaQuery } from 'decentraland-ui'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { isErrorWithMessage } from '../../../lib/error'
import { LinkedProfile } from '../../LinkedProfile'
import { favoritesAPI } from '../../../modules/vendor/decentraland/favorites'
import { Props } from './FavoritesModal.types'
import styles from './FavoritesModal.module.css'

const ITEM_HEIGHT = 55

const FavoritesModal = ({ metadata: { itemId }, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [favorites, setFavorites] = useState<string[]>([])
  const [total, setTotalFavorites] = useState<number>(0)

  const isMobile = useMobileMediaQuery()

  const fetchWhoFavoritedAnItem = useCallback(
    async (assetId: string, limit: number, offset: number) => {
      setIsLoading(true)
      try {
        return favoritesAPI.getWhoFavoritedAnItem(assetId, limit, offset)
      } catch (error) {
        setError(isErrorWithMessage(error) ? error.message : 'Unknown')
      } finally {
        setIsLoading(false)
      }
      return {
        addresses: [],
        total: 0
      }
    },
    [setIsLoading, setError]
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  fetchWhoFavoritedAnItem
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  itemId

  // const fetchNextPage = useCallback(
  //   async (startIndex: number, stopIndex: number) => {
  //     const result = await fetchWhoFavoritedAnItem(
  //       itemId,
  //       stopIndex - startIndex,
  //       startIndex
  //     )
  //     setFavorites(result.addresses)
  //     setTotalFavorites(result.total)
  //   },
  //   [itemId, fetchWhoFavoritedAnItem]
  // )

  const fetchNextPage = useCallback(
    async (startIndex: number, stopIndex: number) => {
      const addresses = Array.from(
        { length: stopIndex - startIndex },
        (_, i) =>
          '0x' +
          (i + startIndex + 1).toString(16).padStart(isMobile ? 18 : 40, '0')
      )
      setFavorites(addresses)
      setTotalFavorites(addresses.length)
    },
    [isMobile]
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
            sliceAddressBy={42}
            address={favorites[index]}
          />
        ) : (
          'Loading....'
        )}
      </div>
    ),
    [favorites, isItemLoaded]
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
      // className={styles.modal}
      // name={'Saved by'}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={'Saved by'}
        onClose={!isLoading ? onClose : undefined}
      />
      <Modal.Content className={styles.content}>
        <>
          <div>
            Only accounts with more than 1 VP are counted.{' '}
            <a href="#">Learn More</a>
          </div>
          <div>The item has not been favorited by anyone</div>
          <div
            className={styles.favoritesList}
            style={{ height: !isMobile ? desktopHeight : undefined }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={favorites.length}
                  loadMoreItems={fetchNextPage}
                >
                  {({ onItemsRendered, ref }) => (
                    <FixedSizeList
                      itemCount={favorites.length}
                      onItemsRendered={onItemsRendered}
                      itemSize={ITEM_HEIGHT}
                      height={height ?? 300}
                      width={width ?? 650}
                      ref={ref}
                    >
                      {Row}
                    </FixedSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </div>
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
