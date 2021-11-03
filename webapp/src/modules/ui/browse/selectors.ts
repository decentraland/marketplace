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
import { Props as OnSaleListItem } from '../../../components/OnSaleList/OnSaleListItem/OnSaleListItem.types'

export const getState = (state: RootState) => state.ui.browse
export const getView = (state: RootState) => getState(state).view
export const getCount = (state: RootState) => getState(state).count

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

export const getOnSaleElements = createSelector<
  RootState,
  string | undefined,
  Record<string, Item>,
  Record<string, NFT>,
  Record<string, Order>,
  OnSaleListItem[]
>(
  getAddress,
  getItemData,
  getNFTData,
  getOrderData,
  (address, itemsById, nftsById, ordersById) => {
    if (!address) {
      return []
    }

    const both: OnSaleListItem[] = []

    const items = Object.values(itemsById)
      .filter(item => item.isOnSale && item.creator === address)
      .sort((itemA, itemB) => (itemA.updatedAt < itemB.updatedAt ? -1 : 0))

    const nfts = Object.values(nftsById)
      .reduce((acc, nft) => {
        if (nft.activeOrderId && ordersById[nft.activeOrderId]) {
          acc.push([nft, ordersById[nft.activeOrderId]])
        }
        return acc
      }, [] as [NFT<VendorName.DECENTRALAND>, Order][])
      .filter(([nft]) => nft.owner === address)
      .sort(([_nftA, orderA], [_nftB, orderB]) =>
        orderA.updatedAt < orderB.updatedAt ? -1 : 0
      )

    while (items.length + nfts.length > 0) {
      const lastItem = items[items.length - 1]
      const lastNft = nfts[nfts.length - 1]

      const pushItem = () => {
        both.push({ item: lastItem })
        items.pop()
      }

      const pushNft = () => {
        const [nft, order] = lastNft
        both.push({ nft, order })
        nfts.pop()
      }

      if (lastItem && !lastNft) {
        pushItem()
      } else if (!lastItem && lastNft) {
        pushNft()
      } else if (lastItem.updatedAt >= lastNft[1].updatedAt) {
        pushItem()
      } else {
        pushNft()
      }
    }

    return both
  }
)
