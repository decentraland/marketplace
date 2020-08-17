import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Vendors } from '../vendor/types'
import { NFTCategory } from '../nft/types'
import { SortDirection, SortBy } from '../routing/types'
import { contractCategories } from '../contract/utils'
import { addressEquals } from '../wallet/utils'
import { NFT, NFTSortBy } from './types'

export function getNFTId(contractAddress: string, tokenId: string) {
  const contractCategory = contractCategories[contractAddress]

  if (!contractCategory) {
    throw new Error(
      `Could not find a valid category for contract ${contractAddress}`
    )
  }

  return contractCategory + '-' + contractAddress + '-' + tokenId
}

export function getNFTName(
  nft: Pick<NFT, 'vendor' | 'name' | 'category' | 'data'>
) {
  if (nft.name) {
    return nft.name
  }

  switch (nft.category) {
    case NFTCategory.PARCEL:
      return t(
        'global.parcel_with_coords',
        (nft as NFT<Vendors.DECENTRALAND>).data.parcel
      )

    case NFTCategory.ESTATE:
      return t('global.estate')

    case NFTCategory.WEARABLE:
      return t('global.wearable')

    case NFTCategory.ENS:
      return t('global.ens')

    case NFTCategory.ART:
      return t('global.art')

    default:
      return t('global.nft')
  }
}

export function getSortOrder(sortBy: SortBy) {
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
