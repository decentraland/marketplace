import BN from 'bn.js'
import { config } from '../../config'

export class MarketplacePrice {
  public oneMillion: BN
  public feePerMillion: BN

  public maxPriceIncreasePercentage: number

  constructor() {
    const feePerMillion = config.get('MARKETPLACE_ADAPTER_FEE_PER_MILLION')

    const maxPriceIncreasePercentage = Number(
      config.get('MAX_PRICE_INCREASE_PERCENTAGE')
    )

    if (!feePerMillion) {
      throw new Error(`Invalid adapter fee ${feePerMillion}`)
    }

    if (!maxPriceIncreasePercentage || isNaN(maxPriceIncreasePercentage)) {
      throw new Error(
        `Invalid max price increase percentage ${maxPriceIncreasePercentage}`
      )
    }

    this.feePerMillion = new BN(feePerMillion)
    this.oneMillion = new BN('1000000')

    this.maxPriceIncreasePercentage = maxPriceIncreasePercentage
  }

  addFee(manaWeiAmount: string | number) {
    const bnAmount = new BN(manaWeiAmount.toString())

    return bnAmount
      .add(bnAmount.mul(this.feePerMillion).div(this.oneMillion))
      .toString()
  }

  addMaxSlippage(manaWeiAmount: string | number) {
    return new BN(manaWeiAmount).mul(new BN(110)).divRound(new BN(100)) // 10 percent increase
  }

  getPercentageIncrease(computedPrice: string, price: string) {
    if (Number(price) <= 0) {
      return 0
    }

    const percentage = new BN(computedPrice)
      .mul(new BN(100))
      .divRound(new BN(price))
      .toNumber()

    return percentage <= 100 ? 0 : percentage - 100
  }

  isAboveMaxIncreasePercentage(percentage: number) {
    return percentage > this.maxPriceIncreasePercentage
  }
}
