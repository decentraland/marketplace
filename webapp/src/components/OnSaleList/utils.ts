import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import { Order } from '../../modules/order/types'
import { useMemo } from 'react'
import { SortBy } from '../../modules/routing/types'
import { Props as Element } from './OnSaleListElement/OnSaleListElement.types'

export const useProcessedElements = (
  elems: Element[],
  search: string,
  sortBy: SortBy
) => {
  const filtered = useMemo(() => filterByName(elems, search), [elems, search])
  const sorted = useMemo(() => sort(filtered, sortBy), [filtered, sortBy])
  return sorted
}

export const filterByName = (elements: Element[], name: string) =>
  elements.filter(element =>
    handleElement(
      element,
      item => item.name.toLowerCase().includes(name.toLowerCase()),
      nft => nft.name.toLowerCase().includes(name.toLowerCase())
    )
  )

export const sort = (elements: Element[], sortBy: SortBy) =>
  elements.sort((elementA, elementB) => {
    switch (sortBy) {
      case SortBy.NEWEST:
        return getUpdatedAt(elementA) > getUpdatedAt(elementB) ? -1 : 0
      case SortBy.NAME:
        return getName(elementA) < getName(elementB) ? -1 : 0
      default:
        return 0
    }
  })

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

const handleElement = <T>(
  { item, nft, order }: Element,
  handleItem: (item: Item) => T,
  handleNFT: (nft: NFT, order: Order) => T
) => (item ? handleItem(item) : handleNFT(nft!, order!))
