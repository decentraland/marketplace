import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

const LAND_PRICE_WARNING_THRESHOLD = 100 // if the listing price of a land is below this number we show a warning

function isLand(nft: NFT) {
  return (
    nft.category === NFTCategory.PARCEL || nft.category === NFTCategory.ESTATE
  )
}

export function showPriceBelowMarketValueWarning(nft: NFT, price: number) {
  return isLand(nft) && price <= LAND_PRICE_WARNING_THRESHOLD
}
