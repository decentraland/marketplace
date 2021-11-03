import { connect } from 'react-redux'
import { getData as getOrders } from '../../modules/order/selectors'
import { getData as getItems } from '../../modules/item/selectors'
import { getData as getNFTs } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import { Item as ComponentItem, MapStateProps } from './OnSaleList.types'
import { NFTCategory } from '@dcl/schemas'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Order } from '../../modules/order/types'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  const ordersById = getOrders(state)

  const itemsById = getItems(state)
  const nftsById = getNFTs(state)

  const items = Object.values(itemsById)
    .filter(item => item.creator === address)
    .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : 0))

  const nfts = Object.values(nftsById)
    .filter(
      nft =>
        nft.owner === address &&
        nft.activeOrderId &&
        ordersById[nft.activeOrderId]
    )
    .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : 0))

  const both: ComponentItem[] = []

  while (items.length + nfts.length > 0) {
    const lastItem = items[items.length - 1]
    const lastNft = nfts[nfts.length - 1]

    console.log(lastItem)
    console.log(lastNft)

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

    const pushNft = (order: Order) => {
      switch (lastNft.category) {
        case NFTCategory.WEARABLE:
          const item = itemsById[lastNft.contractAddress + '-0']
          if (item) {
            both.push({
              title: lastNft.name,
              type: lastNft.category,
              src: lastNft.image,
              network: lastNft.network,
              price: order.price,
              rarity: item.rarity,
              saleType: 'secondary'
            })
            nfts.pop()
          }
          break
        case NFTCategory.ENS:
          both.push({
            title: lastNft.name,
            type: lastNft.category,
            network: lastNft.network,
            price: order.price,
            saleType: 'secondary'
          })
          nfts.pop()
          break
        case NFTCategory.PARCEL:
          const { parcel } = lastNft.data
          if (parcel) {
            both.push({
              title: lastNft.name,
              subtitle: `${parcel.x}/${parcel.y}`,
              type: lastNft.category,
              network: lastNft.network,
              price: order.price,
              saleType: 'secondary'
            })
            nfts.pop()
          }
          break
        case NFTCategory.ESTATE:
          const { estate } = lastNft.data
          if (estate) {
            both.push({
              title: lastNft.name,
              subtitle: `${estate.parcels.length} Parcels`,
              type: lastNft.category,
              network: lastNft.network,
              price: order.price,
              saleType: 'secondary'
            })
            nfts.pop()
          }
          break
      }
    }

    if (lastItem && !lastNft) {
      pushItem()
    } else if (!lastItem && lastNft) {
      pushNft(ordersById[lastNft.activeOrderId!])
    } else {
      const order = ordersById[lastNft.activeOrderId!]

      if (lastItem.updatedAt <= order.updatedAt) {
        pushItem()
      } else {
        pushNft(order)
      }
    }
  }

  return {
    items: both
  }
}

export default connect(mapState)(OnSaleList)
