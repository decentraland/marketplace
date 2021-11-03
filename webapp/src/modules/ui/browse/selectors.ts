import { createSelector } from 'reselect'
import { Item, NFTCategory } from '@dcl/schemas'
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
import { Item as ComponentItem } from '../../../components/OnSaleList/OnSaleList.types'

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
  ComponentItem[]
>(
  getAddress,
  getItemData,
  getNFTData,
  getOrderData,
  (address, itemsById, nftsById, ordersById) => {
    if (!address) {
      return []
    }

    const both: ComponentItem[] = []

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
        both.push({
          title: lastItem.name,
          saleType: 'primary',
          rarity: lastItem.rarity,
          price: lastItem.price,
          network: lastItem.network,
          src: lastItem.thumbnail,
          type: lastItem.category
        })
        items.pop()
      }

      const pushNft = () => {
        const [nft, order] = lastNft
        switch (nft.category) {
          case NFTCategory.WEARABLE:
            const item = itemsById[nft.contractAddress + '-0']
            if (item) {
              both.push({
                title: nft.name,
                type: nft.category,
                src: nft.image,
                network: nft.network,
                price: order.price,
                rarity: item.rarity,
                saleType: 'secondary'
              })
            }
            nfts.pop()
            break
          case NFTCategory.ENS:
            both.push({
              title: nft.name,
              type: nft.category,
              network: nft.network,
              price: order.price,
              saleType: 'secondary'
            })
            nfts.pop()
            break
          case NFTCategory.PARCEL:
            const { parcel } = nft.data
            if (parcel) {
              both.push({
                title: nft.name,
                subtitle: `${parcel.x}/${parcel.y}`,
                type: nft.category,
                network: nft.network,
                price: order.price,
                saleType: 'secondary'
              })
            }
            nfts.pop()
            break
          case NFTCategory.ESTATE:
            const { estate } = nft.data
            if (estate) {
              both.push({
                title: nft.name,
                subtitle: `${estate.parcels.length} Parcels`,
                type: nft.category,
                network: nft.network,
                price: order.price,
                saleType: 'secondary'
              })
            }
            nfts.pop()
            break
          default:
            throw new Error('Invalid Category')
        }
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
