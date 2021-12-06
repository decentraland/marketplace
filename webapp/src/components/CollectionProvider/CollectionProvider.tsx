import React, { useEffect } from 'react'
import { Props } from './CollectionProvider.types'

const CollectionProvider = ({
  collection,
  items,
  isLoading,
  withItems,
  onFetchCollection,
  children
}: Props) => {
  useEffect(() => {
    if (isLoading) {
      return
    }

    if (
      !collection ||
      (withItems && (!items || items.length !== collection.size))
    ) {
      onFetchCollection()
    }
  }, [collection, items, withItems, isLoading, onFetchCollection])

  return <>{children({ collection, items, isLoading })}</>
}

export default React.memo(CollectionProvider)
