import { createSelector } from 'reselect'
import { Item } from '@dcl/schemas'
import { getData as getNFTData } from '../../nft/selectors'
import { getData as getItemData } from '../../item/selectors'
import { getData as getOrderData } from '../../order/selectors'
import { NFTState } from '../../nft/reducer'
import { RootState } from '../../reducer'
import { BrowseUIState } from './reducer'
import { NFT } from '../../nft/types'
import { ItemState } from '../../item/reducer'
import { Order } from '../../order/types'
import { VendorName } from '../../vendor'
import { getAddress } from '../../wallet/selectors'
import { OnSaleElement, OnSaleNFT } from './types'
import { handleOnSaleElement } from './utils'

export const getState = (state: RootState) => state.ui.browse
export const getView = (state: RootState) => getState(state).view
export const getCount = (state: RootState) => getState(state).count
export const getSearch = (state: RootState) => state.ui.browse.search

export const getNFTs = createSelector<
  RootState,
  BrowseUIState,
  NFTState['data'],
  NFT[]
>(getState, getNFTData, (browse, nftsById) =>
  browse.nftIds.map(id => nftsById[id])
)

export const getItems = createSelector<
  RootState,
  BrowseUIState,
  ItemState['data'],
  Item[]
>(getState, getItemData, (browse, itemsById) =>
  browse.itemIds.map(id => itemsById[id])
)

export const getOnSaleItems = createSelector<
  RootState,
  ReturnType<typeof getAddress>,
  ReturnType<typeof getItemData>,
  Item[]
>(getAddress, getItemData, (address, itemsById) =>
  Object.values(itemsById).filter(
    item => item.isOnSale && item.creator === address
  )
)

export const getOnSaleNFTs = createSelector<
  RootState,
  ReturnType<typeof getAddress>,
  ReturnType<typeof getNFTData>,
  ReturnType<typeof getOrderData>,
  OnSaleNFT[]
>(getAddress, getNFTData, getOrderData, (address, nftsById, ordersById) =>
  Object.values(nftsById)
    .reduce((acc, nft) => {
      const { activeOrderId } = nft
      const order = activeOrderId ? ordersById[activeOrderId] : undefined
      if (order) {
        acc.push([nft, order])
      }
      return acc
    }, [] as [NFT<VendorName.DECENTRALAND>, Order][])
    .filter(([nft]) => nft.owner === address)
)

export const getOnSaleElements = createSelector<
  RootState,
  ReturnType<typeof getOnSaleItems>,
  ReturnType<typeof getOnSaleNFTs>,
  OnSaleElement[]
>(getOnSaleItems, getOnSaleNFTs, (items, nfts) => [...items, ...nfts])

export const getOnSaleProcessedElements = createSelector<
  RootState,
  ReturnType<typeof getAddress>,
  ReturnType<typeof getOnSaleElements>,
  string,
  OnSaleElement[]
>(getAddress, getOnSaleElements, getSearch, (address, elements, search) => {
  if (!address) {
    return []
  }

  return elements
    .filter(element =>
      handleOnSaleElement(
        element,
        item => item.name.toLowerCase().includes(search.toLowerCase()),
        ([nft]) => nft.name.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((elementA, elementB) => {
      const getUpdatedAt = (element: any) =>
        handleOnSaleElement(
          element,
          item => item.updatedAt,
          ([_nft, order]) => order.updatedAt
        )
      return getUpdatedAt(elementA) > getUpdatedAt(elementB) ? -1 : 0
    })
})
