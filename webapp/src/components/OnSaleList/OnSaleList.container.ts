import { connect } from 'react-redux'
import { getData as getOrders } from '../../modules/order/selectors'
import {
  getData as getItems,
  getLoading as getItemsLoading
} from '../../modules/item/selectors'
import {
  getData as getNFTs,
  getLoading as getNFTsLoading
} from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import { Item as ComponentItem, MapStateProps } from './OnSaleList.types'
import { NFTCategory } from '@dcl/schemas'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  const ordersById = getOrders(state)

  const itemsById = getItems(state)
  const nftsById = getNFTs(state)

  const isLoading =
    isLoadingType(getItemsLoading(state), FETCH_ITEMS_REQUEST) ||
    isLoadingType(getNFTsLoading(state), FETCH_NFTS_REQUEST)

  const both: ComponentItem[] = []

  if (!isLoading) {
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
  }

  return {
    items: both,
    isLoading
  }
}

export default connect(mapState)(OnSaleList)
