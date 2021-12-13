import React, { useEffect } from 'react'
import { Props } from './StoreProvider.types'

const StoreProvider = ({ isLoading, store, children, onFetchStore }: Props) => {
  useEffect(() => {
    if (!isLoading && !store) {
      onFetchStore()
    }
  }, [isLoading, store, onFetchStore])

  return <>{children({ store, isLoading })}</>
}

export default React.memo(StoreProvider)
