import BN from 'bn.js'
import { toBN } from 'web3x-es/utils'

export class MarketplacePrice {
  public oneMillion: BN
  public feePerMillion: BN

  public maxPriceIncreasePercentage: number

  constructor() {
    const feePerMillion =
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION

    const maxPriceIncreasePercentage = Number(
      process.env.REACT_APP_MAX_PRICE_INCREASE_PERCENTAGE
    )

    if (!feePerMillion) {
      throw new Error(`Invalid adapter fee ${feePerMillion}`)
    }

    if (!maxPriceIncreasePercentage || isNaN(maxPriceIncreasePercentage)) {
      throw new Error(
        `Invalid max price increase percentage ${maxPriceIncreasePercentage}`
      )
    }

    this.feePerMillion = toBN(feePerMillion)
    this.oneMillion = toBN('1000000')

    this.maxPriceIncreasePercentage = maxPriceIncreasePercentage
  }

  addFee(manaWeiAmount: string | number) {
    const bnAmount = toBN(manaWeiAmount.toString())

    return bnAmount
      .add(bnAmount.mul(this.feePerMillion).div(this.oneMillion))
      .toString()
  }

  addMaxSlippage(manaWeiAmount: string | number) {
    return toBN(manaWeiAmount)
      .mul(toBN(110))
      .divRound(toBN(100)) // 10 percent increase
  }

  getPercentageIncrease(computedPrice: string, price: string) {
    const percentage = toBN(computedPrice)
      .mul(toBN(100))
      .divRound(toBN(price))
      .toNumber()

    return percentage <= 100 ? 0 : percentage - 100
  }

  isAboveMaxIncreasePercentage(percentage: number) {
    return percentage > this.maxPriceIncreasePercentage
  }
}
