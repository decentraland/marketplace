import React, { useEffect, useRef } from 'react'
import { Props } from './CollectionProvider.types'

// Caps how many times we request a collection's items. Comparing items.length to collection.size loops
// forever when fewer items come back than the size (e.g. social emotes are filtered out of the response),
// so we bound the attempts. A value > 1 still lets a transient fetch error be retried once.
const MAX_ITEMS_REQUEST_ATTEMPTS = 2

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
  const itemsRequest = useRef<{ contractAddress: string | null; attempts: number }>({ contractAddress: null, attempts: 0 })

  useEffect(() => {
    if (!isLoadingCollection && !collection && !error) {
      onFetchCollection()
    }

    if (!isLoadingCollectionItems && collection && withItems && (!items || items.length !== collection.size)) {
      if (itemsRequest.current.contractAddress !== collection.contractAddress) {
        itemsRequest.current = { contractAddress: collection.contractAddress, attempts: 0 }
      }

      if (itemsRequest.current.attempts < MAX_ITEMS_REQUEST_ATTEMPTS) {
        itemsRequest.current.attempts += 1
        onFetchCollectionItems(collection)
      }
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
