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

export class MarketPrice {
  public feePerMillion: BN

  constructor() {
    const feePerMillion =
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION

    if (!feePerMillion) {
      throw new Error(`Invalid adapter fee ${feePerMillion}`)
    }
    this.feePerMillion = toBN(feePerMillion)
  }

  addFee(manaWeiAmount: string | number) {
    const ONE_MILLION = toBN('1000000')

    const bnAmount = toBN(manaWeiAmount.toString())

    return bnAmount
      .add(bnAmount.add(this.feePerMillion))
      .div(ONE_MILLION)
      .toString()
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
