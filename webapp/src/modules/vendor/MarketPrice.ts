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
  public feePerMillion: number

  constructor() {
    this.feePerMillion = Number(
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION
    )
    if (!this.feePerMillion) {
      throw new Error(`Invalid adapter fee ${this.feePerMillion}`)
    }
  }

  addFee(manaWeiAmount: string | number) {
    const ONE_MILLION = 1000000

    manaWeiAmount = Number(manaWeiAmount)

    return (
      manaWeiAmount +
      (manaWeiAmount * this.feePerMillion) / ONE_MILLION
    ).toString()
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
