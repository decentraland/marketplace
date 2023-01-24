import { Transak as BaseTransak } from 'decentraland-dapps/dist/modules/manaFiatGateway/transak'
import {
  ProductsAvailed,
  TradeType
} from 'decentraland-dapps/dist/modules/manaFiatGateway/transak/types'
import { TransakConfig } from 'decentraland-dapps/dist/modules/manaFiatGateway/types'
import { config } from '../config'
import { Asset } from '../modules/asset/types'
import { isNFT } from '../modules/asset/utils'

// TODO (buy nfts with card): override the callback of the listened events if necessary

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
      tradeType: TradeType.PRIMARY || TradeType.SECONDARY,
      tokenId: isNFT(this.asset) ? this.asset.tokenId : this.asset.itemId,
      productsAvailed: ProductsAvailed.BUY,
      isNFT: true
    }
  }
}
