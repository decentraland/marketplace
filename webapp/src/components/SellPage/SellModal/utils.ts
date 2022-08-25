import { NFT } from '../../../modules/nft/types'
import { isLand } from '../../../modules/nft/utils'

const LAND_PRICE_WARNING_THRESHOLD = 100 // if the listing price of a land is below this number we show a warning

export function showPriceBelowMarketValueWarning(nft: NFT, price: number) {
  return isLand(nft) && price <= LAND_PRICE_WARNING_THRESHOLD
}
