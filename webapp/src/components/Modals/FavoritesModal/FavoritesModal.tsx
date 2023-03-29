import React, { useCallback, useEffect, useState } from 'react'
import { ModalNavigation, Message, Loader } from 'decentraland-ui'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { isErrorWithMessage } from '../../../lib/error'
import { Props } from './FavoritesModal.types'
import styles from './ConfirmRentModal.module.css'
import { LinkedProfile } from '../../LinkedProfile'

const FavoritesModal = ({ metadata: { assetId }, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [limit, setLimit] = useState<number>(100)
  const [offset, setOffset] = useState<number>(0)
  const [favorites, setFavorites] = useState<string[]>([])

  const fetchFavorites = useCallback(
    async (assetId: string, limit: number, offset: number) => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://marketplace-favorites-api.decentraland.zone/v1/picks/${assetId}?limit=${limit}&offset=${offset}`
        )
        const parsedResponse = await response.json()
        return parsedResponse
      } catch (error) {
        setError(isErrorWithMessage(error) ? error.message : 'Unknown')
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLoading, setError]
  )

  useEffect(() => {
    fetchFavorites(assetId, limit, offset).then(favorites =>
      setFavorites(favorites)
    )
  }, [assetId])

  return (
    <Modal
      size="small"
      className={styles.modal}
      name={'Saved by'}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={'Only accounts with more than 1 VP are counted. Learn More'}
        onClose={!isLoading ? onClose : undefined}
      />
      <Modal.Content>
        <InfiniteLoader
          isNextPageLoading={isLoading}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
              {...otherListProps}
            />
            // <LinkedProfile address={address} />
          )}
        </InfiniteLoader>
        {error ? (
          <Message
            error
            size="tiny"
            visible
            content={error}
            header={t('global.error')}
          />
        ) : null}
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(FavoritesModal)
