import { NFTCategory, Order, RentalListing } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../nft/types'
import { locations } from '../routing/locations'
import { addressEquals } from '../wallet/utils'
import { Asset } from './types'

export function getAssetName(asset: Asset) {
  if (asset.name) {
    return asset.name
  }

  switch (asset.category) {
    case NFTCategory.PARCEL:
      return t('global.parcel_with_coords', (asset as NFT).data.parcel)

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

export function getAssetImage(asset: Asset) {
  if ('image' in asset) {
    return asset.image
  }
  if ('thumbnail' in asset) {
    return asset.thumbnail
  }
  return ''
}

export function getAssetUrl(asset: Asset, isManager?: boolean) {
  if ('tokenId' in asset && !isManager) {
    return locations.nft(asset.contractAddress, asset.tokenId)
  }
  if ('tokenId' in asset && isManager) {
    return locations.manage(asset.contractAddress, asset.tokenId)
  }
  if ('itemId' in asset && asset.itemId !== null) {
    return locations.item(asset.contractAddress, asset.itemId)
  }
  return ''
}

export function getAssetPrice(asset: Asset, order?: Order) {
  return 'price' in asset
    ? asset.isOnSale
      ? asset.price
      : null
    : order
    ? order.price
    : null
}

export function isOwnedBy(
  asset: Asset,
  wallet: Wallet | null,
  rental?: RentalListing
) {
  const assetAddress = 'owner' in asset ? asset.owner : asset.creator
  return (
    addressEquals(wallet?.address, assetAddress) ||
    addressEquals(wallet?.address, rental?.lessor ?? undefined)
  )
}

export function isNFT(asset: Asset): asset is NFT {
  return 'tokenId' in asset
}
