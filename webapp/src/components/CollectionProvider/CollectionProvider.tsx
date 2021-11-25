import React, { useEffect } from 'react'
import { Props } from './CollectionProvider.types'

const CollectionProvider = ({
  collection,
  items,
  isLoading,
  withItems,
  onFetchCollections,
  children
}: Props) => {
  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!collection || (withItems && !items)) {
      onFetchCollections()
    }
  }, [collection, items, withItems, isLoading, onFetchCollections])

  return <>{children({ collection, items, isLoading })}</>
}

export default React.memo(CollectionProvider)
