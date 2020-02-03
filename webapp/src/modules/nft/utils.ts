import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SortDirection, SortBy } from '../routing/search'
import { nftContracts } from '../contract/utils'
import { NFT, NFTCategory, NFTSortBy } from './types'

export function getNFTId(
  contractAddress: string | null,
  tokenId: string | null
) {
  if (!contractAddress || !tokenId) return
  const contract = contractAddress ? nftContracts[contractAddress] : null
  if (contract) {
    return contract.category + '-' + contractAddress + '-' + tokenId
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
    default:
      return t('global.nft')
  }
}

export function getSortOrder(sortBy: SortBy) {
  let orderBy: NFTSortBy = NFTSortBy.CREATED_AT
  let orderDirection: SortDirection = SortDirection.DESC
  switch (sortBy) {
    case SortBy.NEWEST: {
      orderBy = NFTSortBy.CREATED_AT
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
  return nft
}
