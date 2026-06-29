import { useEffect, useState } from 'react'
import { Item } from '@dcl/schemas'
import { ItemAPI } from '../../../modules/vendor/decentraland/item/api'
import { ItemFilters } from '../../../modules/vendor/decentraland/item/types'
import { MARKETPLACE_SERVER_URL } from '../../../modules/vendor/decentraland/marketplace/api'

// Demo: a lightweight, self-contained item fetcher (no sagas/redux) used to
// power the detail page's collection strip / bundle / creator sections.
const itemAPI = new ItemAPI(MARKETPLACE_SERVER_URL, { retries: 1 })

function useItems(filters: ItemFilters | null) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const key = filters ? JSON.stringify(filters) : null

  useEffect(() => {
    if (!key) return
    let cancelled = false
    setIsLoading(true)
    itemAPI
      .get(JSON.parse(key) as ItemFilters)
      .then(res => !cancelled && setItems(res.data))
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [key])

  return { items, isLoading }
}

// Other items in the same collection (same contract).
export function useCollectionItems(contractAddress?: string, first = 12) {
  return useItems(contractAddress ? { contractAddresses: [contractAddress], first } : null)
}

// Other items from the same creator (used for "more from the creator").
export function useCreatorItems(creator?: string, first = 12) {
  return useItems(creator ? { creator, first } : null)
}
