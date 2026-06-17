import React, { useEffect, useRef } from 'react'
import { Props } from './CollectionProvider.types'

const CollectionProvider = ({
  collection,
  items,
  isLoadingCollection,
  isLoadingCollectionItems,
  withItems,
  contractAddress,
  onFetchCollection,
  onFetchCollectionItems,
  children,
  error
}: Props) => {
  // Tracks the collection we've already requested items for, so we don't refetch on a count mismatch.
  // Comparing items.length to collection.size loops forever when fewer items come back than the size
  // (e.g. social emotes are filtered out of the response).
  const requestedItemsForContract = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoadingCollection && !collection && !error) {
      onFetchCollection()
    }

    if (
      !isLoadingCollectionItems &&
      collection &&
      withItems &&
      requestedItemsForContract.current !== collection.contractAddress &&
      (!items || items.length !== collection.size)
    ) {
      requestedItemsForContract.current = collection.contractAddress
      onFetchCollectionItems(collection)
    }
  }, [
    collection,
    items,
    contractAddress,
    withItems,
    onFetchCollection,
    isLoadingCollection,
    isLoadingCollectionItems,
    onFetchCollectionItems,
    error
  ])

  return (
    <>
      {children({
        collection,
        items,
        isLoading: isLoadingCollection || isLoadingCollectionItems
      })}
    </>
  )
}

export default React.memo(CollectionProvider)
