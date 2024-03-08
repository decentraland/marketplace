import { ChainId, Item, ListingStatus, NFTCategory, Network } from '@dcl/schemas'
import { FavoritesData } from '../../favorites/types'
import { BrowseUIState } from './reducer'
import { LegacyOrderFragment } from '../../order/types'
import { OnSaleElement } from './types'
import { VendorName } from '../../vendor'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export function orderById(ids: string[], items: Item[]) {
  const itemsById = Object.fromEntries(items.map(item => [item.id, item]))
  return ids.map(id => itemsById[id])
}

export const byFavoriteCreatedAtAsc = (favoritedItems: Record<string, FavoritesData>) => (a: Item, b: Item) => {
  const favoriteACreatedAt = favoritedItems[a.id]?.createdAt ?? 0
  const favoriteBCreatedAt = favoritedItems[b.id]?.createdAt ?? 0
  if (favoriteACreatedAt < favoriteBCreatedAt) {
    return 1
  } else if (favoriteACreatedAt > favoriteBCreatedAt) {
    return -1
  }
  return 0
}

export const isLoadingMoreResults = (state: BrowseUIState, page?: number) => {
  return !!state.page && !!page && page > state.page
}

export function legacyOrderToOnSaleElement(legacyOrder: LegacyOrderFragment): OnSaleElement {
  return [
    {
      category: NFTCategory.PARCEL,
      chainId: ChainId.ETHEREUM_MAINNET,
      contractAddress: legacyOrder.nft.contractAddress,
      tokenId: legacyOrder.nft.tokenId,
      openRentalId: null,
      owner: legacyOrder.nft.owner.id,
      name: legacyOrder.nft.name || t('global.parcel'),
      image: legacyOrder.nft.image,
      issuedId: null,
      itemId: null,
      url: '',
      network: Network.ETHEREUM,
      createdAt: +legacyOrder.nft.createdAt,
      updatedAt: +legacyOrder.nft.createdAt,
      soldAt: +legacyOrder.nft.createdAt,
      vendor: VendorName.DECENTRALAND,
      activeOrderId: legacyOrder.id,
      id: legacyOrder.nft.id,
      data: {
        parcel: {
          description: null,
          estate: null,
          x: legacyOrder.nft.parcel.x,
          y: legacyOrder.nft.parcel.y
        }
      }
    },
    {
      id: legacyOrder.id,
      marketplaceAddress: legacyOrder.marketplaceAddress,
      contractAddress: legacyOrder.nft.contractAddress,
      tokenId: legacyOrder.tokenId,
      owner: legacyOrder.owner,
      createdAt: +legacyOrder.createdAt,
      updatedAt: +legacyOrder.updatedAt,
      expiresAt: +legacyOrder.expiresAt,
      issuedId: '',
      network: Network.ETHEREUM,
      status: legacyOrder.status as ListingStatus,
      buyer: null,
      chainId: ChainId.ETHEREUM_MAINNET,
      price: legacyOrder.price
    }
  ]
}
