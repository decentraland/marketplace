import { Item, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorName } from '../vendor/types'
import { SortDirection, SortBy } from '../routing/types'
import { addressEquals } from '../wallet/utils'
import { NFT, NFTSortBy } from './types'
import { locations } from '../routing/locations'

export function getNFTId(contractAddress: string, tokenId: string) {
  return contractAddress + '-' + tokenId
}

// TODO: Move all  (..)Asset(..) functions to an asset module
export function getAssetName(asset: NFT | Item) {
  if (asset.name) {
    return asset.name
  }

  switch (asset.category) {
    case NFTCategory.PARCEL:
      return t(
        'global.parcel_with_coords',
        (asset as NFT<VendorName.DECENTRALAND>).data.parcel
      )

    case NFTCategory.ESTATE:
      return t('global.estate')

    case NFTCategory.WEARABLE:
      return t('global.wearable')

    case NFTCategory.ENS:
      return t('global.ens')

    case 'art':
      return t('global.art')

    default:
      return t('global.nft')
  }
}

export function getAssetImage(asset: NFT | Item) {
  if ('image' in asset) {
    return asset.image
  }
  if ('thumbnail' in asset) {
    return asset.thumbnail
  }
  return ''
}

export function getAssetUrl(asset: NFT | Item) {
  if ('image' in asset) {
    return locations.nft(asset.contractAddress, asset.tokenId)
  }
  if ('thumbnail' in asset) {
    return locations.item(asset.contractAddress, asset.itemId)
  }
  return ''
}

export function getOrder(sortBy: SortBy) {
  let orderBy: NFTSortBy = NFTSortBy.CREATED_AT
  let orderDirection: SortDirection = SortDirection.DESC

  switch (sortBy) {
    case SortBy.NAME: {
      orderBy = NFTSortBy.NAME
      orderDirection = SortDirection.ASC
      break
    }
    case SortBy.NEWEST: {
      orderBy = NFTSortBy.CREATED_AT
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.RECENTLY_LISTED: {
      orderBy = NFTSortBy.ORDER_CREATED_AT
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.CHEAPEST: {
      orderBy = NFTSortBy.PRICE
      orderDirection = SortDirection.ASC
      break
    }
  }

  return [orderBy, orderDirection] as const
}

export function getSortBy(orderBy: NFTSortBy) {
  let sortBy: SortBy = SortBy.NEWEST

  switch (orderBy) {
    case NFTSortBy.NAME: {
      sortBy = SortBy.NAME
      break
    }
    case NFTSortBy.CREATED_AT: {
      sortBy = SortBy.NEWEST
      break
    }
    case NFTSortBy.ORDER_CREATED_AT: {
      sortBy = SortBy.RECENTLY_LISTED
      break
    }
    case NFTSortBy.PRICE: {
      sortBy = SortBy.CHEAPEST
      break
    }
  }

  return sortBy
}

// TODO: Both getNFTId and this method are repeated on item/utils and can be moved to asset/utils
export function getNFT(
  contractAddress: string | null,
  tokenId: string | null,
  nfts: Record<string, NFT>
): NFT | null {
  if (!contractAddress || !tokenId) {
    return null
  }

  const nftId = getNFTId(contractAddress, tokenId)
  return nftId in nfts ? nfts[nftId] : null
}

export function isOwnedBy(nft: NFT, wallet: Wallet | null) {
  return addressEquals(wallet?.address, nft.owner)
}
