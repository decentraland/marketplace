import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import { Order } from '../../modules/order/types'
import { useMemo } from 'react'
import { SortBy } from '../../modules/routing/types'
import { Props as Element } from './OnSaleListElement/OnSaleListElement.types'

export const useProcessedElements = (
  elements: Element[],
  search: string,
  sort: SortBy
) => {
  const filtered = useMemo(
    () =>
      elements.filter(element =>
        handleElement(
          element,
          item => item.name.toLowerCase().includes(search.toLowerCase()),
          nft => nft.name.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [elements, search]
  )

  const sorted = useMemo(
    () =>
      filtered.sort((elementA, elementB) => {
        switch (sort) {
          case SortBy.NEWEST:
            return getUpdatedAt(elementA) > getUpdatedAt(elementB) ? -1 : 0
          case SortBy.NAME:
            return getName(elementA) < getName(elementB) ? -1 : 0
          default:
            return 0
        }
      }),
    [filtered, sort]
  )

  return sorted
}

const getName = (element: Element) =>
  handleElement(
    element,
    item => item.name,
    nft => nft.name
  )

const getUpdatedAt = (element: Element) =>
  handleElement(
    element,
    item => item.updatedAt,
    (_nft, order) => order.updatedAt
  )

export const handleElement = <T>(
  { item, nft, order }: Element,
  handleItem: (item: Item) => T,
  handleNFT: (nft: NFT, order: Order) => T
) => (item ? handleItem(item) : handleNFT(nft!, order!))
