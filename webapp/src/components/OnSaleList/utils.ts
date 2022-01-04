import { Item, Order } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import { useMemo } from 'react'
import { SortBy } from '../../modules/routing/types'
import { Props as Element } from './OnSaleListElement/OnSaleListElement.types'

export const useProcessedElements = (
  elems: Element[],
  search: string,
  sortBy: SortBy,
  page: number,
  perPage: number
) => {
  const filtered = useMemo(() => filterByName(elems, search), [elems, search])
  const total = useMemo(() => filtered.length, [filtered])
  const sorted = useMemo(() => sort(filtered, sortBy), [filtered, sortBy])
  const paginated = useMemo(() => paginate(sorted, page, perPage), [
    sorted,
    page,
    perPage
  ])

  return {
    paginated,
    total
  }
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
  [...elements].sort((elementA, elementB) => {
    switch (sortBy) {
      case SortBy.NEWEST:
        return getUpdatedAt(elementA) > getUpdatedAt(elementB) ? -1 : 0
      case SortBy.NAME:
        return getName(elementA) < getName(elementB) ? -1 : 0
      default:
        return 0
    }
  })

export const paginate = (
  elements: Element[],
  page: number,
  perPage: number
) => {
  const start = (page - 1) * perPage
  const end = Math.min(start + perPage, elements.length)
  return elements.slice(start, end)
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

const handleElement = <T>(
  { item, nft, order }: Element,
  handleItem: (item: Item) => T,
  handleNFT: (nft: NFT, order: Order) => T
) => (item ? handleItem(item) : handleNFT(nft!, order!))
