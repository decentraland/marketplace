import { Item } from '@dcl/schemas'
import { toBN } from 'web3x/utils'
import { Asset, AssetType } from '../../../modules/asset/types'

export function isValidSalePrice(type: AssetType, asset: Asset) {
  if (type === AssetType.ITEM) {
    const { price } = asset as Item
    const minSaleValue = getMinSaleValueInWei()
    return toBN(price).gt(toBN(minSaleValue))
  }
  return true
}

export function getMinSaleValueInWei(): string {
  return process.env.REACT_APP_MIN_SALE_VALUE_IN_WEI || '0'
}
