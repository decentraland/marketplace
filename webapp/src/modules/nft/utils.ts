import { NFT } from './types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export function getNFTName(nft: NFT) {
  if (nft.name) {
    return nft.name
  }
  if (nft.parcel) {
    return t('global.parcel')
  }
  if (nft.estate) {
    return t('global.estate')
  }
  if (nft.wearable) {
    return t('global.wearable')
  }
}
