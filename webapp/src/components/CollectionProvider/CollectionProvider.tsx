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
  children,
  error
}: Props) => {
  useEffect(() => {
    if (!isLoadingCollection && !collection && !error) {
      onFetchCollection()
    }

    if (!isLoadingCollectionItems && collection && withItems && (!items || items.length !== collection.size)) {
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
