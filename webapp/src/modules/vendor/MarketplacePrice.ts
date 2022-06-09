import { ethers } from 'ethers'
import { config } from '../../config'

export class MarketplacePrice {
  public oneMillion: ethers.BigNumber
  public feePerMillion: ethers.BigNumber

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

    this.feePerMillion = ethers.BigNumber.from(feePerMillion)
    this.oneMillion = ethers.BigNumber.from('1000000')

    this.maxPriceIncreasePercentage = maxPriceIncreasePercentage
  }

  addFee(manaWeiAmount: string | number) {
    const bnAmount = ethers.BigNumber.from(manaWeiAmount.toString())

    return bnAmount
      .add(bnAmount.mul(this.feePerMillion).div(this.oneMillion))
      .toString()
  }

  addMaxSlippage(manaWeiAmount: string | number) {
    return ethers.BigNumber.from(manaWeiAmount)
      .mul(110)
      .div(100) // 10 percent increase
  }

  isAboveMaxIncreasePercentage(percentage: number) {
    return percentage > this.maxPriceIncreasePercentage
  }
}
