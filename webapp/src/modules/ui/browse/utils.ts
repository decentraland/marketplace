import { Item } from '@dcl/schemas'
import { OnSaleElement, OnSaleNFT } from './types'

export const isOnSaleNFT = (element: OnSaleElement) => Array.isArray(element)

export const handleOnSaleElement = <T>(
  element: OnSaleElement,
  handleItem: (item: Item) => T,
  handleNft: (nft: OnSaleNFT) => T
) =>
  isOnSaleNFT(element)
    ? handleNft(element as OnSaleNFT)
    : handleItem(element as Item)
