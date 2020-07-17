import BN from 'bn.js'
import { toBN } from 'web3x-es/utils'

export class MarketplacePrice {
  public oneMillion: BN
  public feePerMillion: BN

  constructor() {
    const feePerMillion =
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION

    if (!feePerMillion) {
      throw new Error(`Invalid adapter fee ${feePerMillion}`)
    }

    this.feePerMillion = toBN(feePerMillion)
    this.oneMillion = toBN('1000000')
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
}
