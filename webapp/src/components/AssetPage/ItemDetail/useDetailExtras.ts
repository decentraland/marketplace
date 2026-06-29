import { useEffect, useState } from 'react'
import { CatalogFilters, Item } from '@dcl/schemas'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import { ItemAPI } from '../../../modules/vendor/decentraland/item/api'
import { ItemFilters } from '../../../modules/vendor/decentraland/item/types'
import { MARKETPLACE_SERVER_URL } from '../../../modules/vendor/decentraland/marketplace/api'

// Demo: a lightweight, self-contained item fetcher (no sagas/redux) used to
// power the detail page's collection strip / bundle / creator sections.
const itemAPI = new ItemAPI(MARKETPLACE_SERVER_URL, { retries: 1 })

function useItems(key: string | null, source: 'item' | 'catalog') {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    setIsLoading(true)
    const filters = JSON.parse(key) as ItemFilters & CatalogFilters
    const request = source === 'catalog' ? catalogAPI.get(filters) : itemAPI.get(filters)
    request
      .then(res => !cancelled && setItems(res.data))
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [key, source])

  return { items, isLoading }
}

// Other items in the same collection (same contract).
export function useCollectionItems(contractAddress?: string, first = 12) {
  const key = contractAddress ? JSON.stringify({ contractAddresses: [contractAddress], first }) : null
  return useItems(key, 'item')
}

// Other items from the same creator — fetched from the CATALOG so the cards
// render the full catalog layout (rarity chip on hover, etc.) like everywhere.
export function useCreatorItems(creator?: string, first = 12) {
  const key = creator ? JSON.stringify({ creator, first }) : null
  return useItems(key, 'catalog')
}
