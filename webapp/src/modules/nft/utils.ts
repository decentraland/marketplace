import { NFT, NFTCategory } from './types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

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
