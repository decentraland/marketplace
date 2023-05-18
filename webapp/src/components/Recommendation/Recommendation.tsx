import { useEffect, useMemo, useState } from 'react'
import { Item } from '@dcl/schemas'
import { isErrorWithMessage } from '../../lib/error'
import { ItemAPI } from '../../modules/vendor/decentraland/item/api'
import { Slideshow } from '../HomePage/Slideshow'
import { Asset } from '../../modules/asset/types'
import { View } from '../../modules/ui/types'
import { NFT_SERVER_URL } from '../../modules/vendor/decentraland'
import { RECO_TYPE } from './Recommendation.types'

const RECOMMENDER_URL = 'http://localhost:8000'

export const Recommendation = ({
  itemId,
  type
}: {
  itemId: string
  type: RECO_TYPE
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [items, setItems] = useState<Item[]>([])
  const itemAPI = useMemo(
    () =>
      new ItemAPI(NFT_SERVER_URL, {
        retries: 3,
        retryDelay: 1000
      }),
    []
  )

  useEffect(() => {
    setIsLoading(true)
    fetch(`${RECOMMENDER_URL}/recommendation/${itemId}?type=${type}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 404) {
          throw Error('No recommendation found')
        }
      })
      // mockedFetch()
      .then(itemIDs => itemAPI.get({ ids: itemIDs }))
      .then(response => {
        setItems(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
        setError(isErrorWithMessage(error) ? error.message : 'Unknown error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Slideshow
      view={View.HOME_NEW_ITEMS}
      title={
        type === RECO_TYPE.SIMILARITY
          ? 'You may also like'
          : 'People also bought'
      }
      onViewAll={() => undefined}
      hasItemsSection={false}
      showViewAll={false}
      emptyMessage={error ?? undefined}
      assets={items as Asset[]}
      isLoading={isLoading}
    />
  )
}
