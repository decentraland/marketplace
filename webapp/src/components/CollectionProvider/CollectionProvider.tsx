import React, { useEffect } from 'react'
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
  children
}: Props) => {
  useEffect(() => {
    if (!isLoadingCollection && !collection) {
      onFetchCollection()
    }

    if (
      !isLoadingCollectionItems &&
      collection &&
      withItems &&
      (!items || items.length !== collection.size)
    ) {
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
    onFetchCollectionItems
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
