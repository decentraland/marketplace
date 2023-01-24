import { call, put, race, take } from 'redux-saga/effects'
import { NFTCategory, Order, RentalListing } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { SET_PURCHASE } from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { CloseModalAction, CLOSE_MODAL, openModal } from '../modal/actions'
import { NFT } from '../nft/types'
import { locations } from '../routing/locations'
import { addressEquals } from '../wallet/utils'
import { openTransak } from '../transak/actions'
import { Asset } from './types'

export const BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY =
  'buy-nfts-with-card-explanation-popup-key'

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
  const isLoggedUserTheOwner = addressEquals(wallet?.address, assetAddress)
  // this also covers the case of the rental being OPEN, since the asset owner will be the
  if (!rental || isLoggedUserTheOwner) {
    return isLoggedUserTheOwner
  }

  // If the asset was transfered with an open listing, it will be change to CANCELLED
  // but rental lessor will still be the past owner.
  const rentalsContract: ContractData = getContract(
    ContractName.Rentals,
    (asset as NFT).chainId
  )
  const rentalContractHasTheAsset =
    rentalsContract.address === (asset as NFT).owner
  if (rental && rentalContractHasTheAsset) {
    // if the asset is not in the rental contracts, it has been transfered and should not have owner permissions
    return addressEquals(wallet?.address, rental?.lessor ?? undefined)
  }

  return false
}

export function isNFT(asset: Asset): asset is NFT {
  return 'tokenId' in asset
}

export function isWearableOrEmote(asset: Asset): boolean {
  const categories: Array<typeof asset.category> = [
    NFTCategory.WEARABLE,
    NFTCategory.EMOTE
  ]
  return categories.includes(asset.category)
}

export function* buyAssetWithCard(asset: Asset) {
  const buyNftsWithCardExplanationPopupKey: string | null = yield call(
    [localStorage, 'getItem'],
    BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
  )

  if (buyNftsWithCardExplanationPopupKey === 'true') {
    yield put(openTransak(asset))
    return
  }

  yield put(openModal('BuyWithCardExplanationModal', { asset }))

  const { close }: { close: CloseModalAction } = yield race({
    continue: take(SET_PURCHASE),
    close: take(CLOSE_MODAL)
  })

  if (close) {
    return
  }

  yield call(
    [localStorage, 'setItem'],
    BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY,
    'true'
  )
}
