export class Partner {
  public adapterFeePerMillion: number

  constructor() {
    this.adapterFeePerMillion = Number(
      process.env.REACT_APP_MARKETPLACE_ADAPTER_FEE_PER_MILLION
    )
    if (!this.adapterFeePerMillion) {
      throw new Error(`Invalid adapter fee ${this.adapterFeePerMillion}`)
    }
  }

  addMarketplaceFee(manaWeiAmount: string | number) {
    const ONE_MILLION = 1000000

    manaWeiAmount = Number(manaWeiAmount)

    return (
      manaWeiAmount +
      (manaWeiAmount * this.adapterFeePerMillion) / ONE_MILLION
    ).toString()
  }

  async ethToMANA(ethAmount: number) {
    const response = await window.fetch(
      'https://api.coingecko.com/api/v3/coins/decentraland/tickers?exchange_ids=uniswap'
    )
    const coinTickers: CoinTickers = await response.json()
    const uniswapTicker = coinTickers.tickers[0]

    return ethAmount / uniswapTicker.converted_last.eth
  }
}

type Ticker = {
  base: string
  target: 'ETH' | 'BTC'
  market: {
    name: string
    identifier: string
    has_trading_incentive: boolean
  }
  last: number
  volume: number
  converted_last: {
    btc: number
    eth: number
    usd: number
  }
  converted_volume: {
    btc: number
    eth: number
    usd: number
  }
  trust_score: 'green' | 'red'
  bid_ask_spread_percentage: number
  timestamp: string
  last_traded_at: string
  last_fetch_at: string
  is_anomaly: boolean
  is_stale: boolean
  trade_url: string
  coin_id: string
  target_coin_id: 'ethereum' | 'bitcoin'
}

type CoinTickers = {
  name: string
  tickers: Ticker[]
}
