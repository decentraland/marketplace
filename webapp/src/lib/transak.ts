import { Transak as BaseTransak } from 'decentraland-dapps/dist/modules/gateway/transak'
import {
  ProductsAvailed,
  TradeType
} from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { TransakConfig } from 'decentraland-dapps/dist/modules/gateway/types'
import { config } from '../config'
import { Asset } from '../modules/asset/types'
import { isNFT } from '../modules/asset/utils'

export class Transak extends BaseTransak {
  constructor(asset: Asset) {
    const transakConfig: TransakConfig = {
      key: config.get('TRANSAK_KEY'),
      env: config.get('TRANSAK_ENV')
    }
    const providedCustomizationOptions = {
      contractAddress: asset.contractAddress,
      tradeType: isNFT(asset) ? TradeType.SECONDARY : TradeType.PRIMARY,
      tokenId: isNFT(asset) ? asset.tokenId : asset.itemId,
      productsAvailed: ProductsAvailed.BUY,
      isNFT: true
    }
    super(transakConfig, providedCustomizationOptions)
  }
}
