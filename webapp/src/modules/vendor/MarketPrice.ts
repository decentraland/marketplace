import BN from 'bn.js'
import { toBN } from 'web3x-es/utils'

type Ticker = {
  converted_last: {
    eth: number
  }
}

type CoinTickers = {
  name: string
  tickers: Ticker[]
}

export enum TransferType {
  SAFE_TRANSFER_FROM = 0,
  TRANSFER_FROM = 1,
  TRANSFER = 2
}

export class MarketPrice {
  public oneMillion: BN
  public feePerMillion: BN

  constructor() {
    const feePerMillion =
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION

    this.oneMillion = toBN('1000000')

    if (!feePerMillion) {
      throw new Error(`Invalid adapter fee ${feePerMillion}`)
    }
    this.feePerMillion = toBN(feePerMillion)
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

  async convertEthToMANA(ethAmount: number) {
    const response = await window.fetch(
      'https://api.coingecko.com/api/v3/coins/decentraland/tickers?exchange_ids=uniswap'
    )
    const coinTickers: CoinTickers = await response.json()
    const uniswapTicker = coinTickers.tickers[0]

    return ethAmount / uniswapTicker.converted_last.eth
  }
}
