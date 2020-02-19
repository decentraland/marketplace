import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { SortDirection, SortBy } from '../routing/search'
import { contractCategories } from '../contract/utils'
import { addressEquals } from '../wallet/utils'
import { NFT, NFTCategory, NFTSortBy } from './types'

export function getNFTId(
  contractAddress: string | null,
  tokenId: string | null
) {
  if (!contractAddress || !tokenId) return
  const contractCategory = contractAddress
    ? contractCategories[contractAddress]
    : null
  if (contractCategory) {
    return contractCategory + '-' + contractAddress + '-' + tokenId
  }
  return null
}

export function getNFTName(nft: NFT) {
  if (nft.name) {
    return nft.name
  }

  switch (nft.category) {
    case NFTCategory.PARCEL:
      return t('global.parcel')

    case NFTCategory.ESTATE:
      return t('global.estate')

    case NFTCategory.WEARABLE:
      return t('global.wearable')

    case NFTCategory.ENS:
      return t('global.ens')

    default:
      return t('global.nft')
  }
}

export function getSortOrder(sortBy: SortBy) {
  let orderBy: NFTSortBy = NFTSortBy.NAME
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
) {
  let nft = null
  const nftId = getNFTId(contractAddress, tokenId)
  if (nftId && nftId in nfts) {
    nft = nfts[nftId]
  }
  console.log(contractAddress, tokenId, nftId, nfts, nft)
  return nft
}

export function isOwnedBy(nft: NFT, wallet: Wallet | null) {
  return addressEquals(wallet?.address, nft.owner.address)
}
