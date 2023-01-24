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
  private readonly asset: Asset

  constructor(asset: Asset) {
    const transakConfig: TransakConfig = {
      key: config.get('TRANSAK_KEY'),
      env: config.get('TRANSAK_ENV')
    }
    super(transakConfig)
    this.asset = asset
  }

  protected customizationOptions(address: string) {
    return {
      ...super.defaultCustomizationOptions(address),
      contractAddress: this.asset.contractAddress,
      tradeType: isNFT(this.asset) ? TradeType.SECONDARY : TradeType.PRIMARY,
      tokenId: isNFT(this.asset) ? this.asset.tokenId : this.asset.itemId,
      productsAvailed: ProductsAvailed.BUY,
      isNFT: true
    }
  }
}
