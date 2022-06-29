import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { config } from '../../config'
import { Converter__factory } from '../../contracts'

type Ticker = {
  converted_last: {
    eth: number
  }
}

type CoinTickers = {
  name: string
  tickers: Ticker[]
}

// { coinId: {ethAmount: result } }
const pricesCache: Record<string, Record<number, number>> = {}

export class TokenConverter {
  apiURL: string
  converterAddress: string
  converterExchange: string

  constructor() {
    const apiURL = config.get('COINGECKO_API_URL')!
    const converterAddress = config.get('CONVERTER_ADDRESS')!
    const converterExchange = config.get('CONVERTER_EXCHANGE')!

    if (!apiURL) {
      throw new Error(`Invalid converter API URL "${apiURL}"`)
    }
    if (!converterAddress) {
      throw new Error(`Invalid converter address "${converterAddress}"`)
    }
    if (!converterExchange) {
      throw new Error(`Invalid converter exchange ${converterExchange}`)
    }

    this.apiURL = apiURL
    this.converterAddress = converterAddress
    this.converterExchange = converterExchange
  }

  async marketEthToMANA(ethAmount: number) {
    return this.marketEthToToken(
      ethAmount,
      'decentraland',
      this.converterExchange
    )
  }

  async marketEthToToken(
    ethAmount: number,
    coinId: string,
    exchange: string = ''
  ) {
    if (!pricesCache[coinId]) {
      pricesCache[coinId] = {}
    }

    if (!pricesCache[coinId][ethAmount]) {
      const response = await window.fetch(
        `${this.apiURL}/coins/${coinId}/tickers?exchange_ids=${exchange}`
      )
      const coinTickers: CoinTickers = await response.json()
      const ticker = coinTickers.tickers[0]

      pricesCache[coinId][ethAmount] = ethAmount / ticker.converted_last.eth
    }

    return pricesCache[coinId][ethAmount]
  }

  async contractEthToMANA(ethAmount: string) {
    const manaAddress = config.get('MANA_ADDRESS')!
    return this.contractEthToToken(ethAmount, manaAddress)
  }

  async contractEthToToken(
    ethAmount: string,
    tokenAddress: string
  ): Promise<string> {
    const converter = Converter__factory.connect(
      this.converterAddress,
      await getSigner()
    )
    const tokens = await converter.calcNeededTokensForEther(
      tokenAddress,
      ethAmount
    )
    return tokens.toString()
  }
}
