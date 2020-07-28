import { Address } from 'web3x-es/address'
import { Converter } from '../../contracts/Converter'
import { ContractFactory } from '../contract/ContractFactory'

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
    const apiURL = process.env.REACT_APP_COINGECKO_API_URL!
    const converterAddress = process.env.REACT_APP_CONVERTER_ADDRESS!
    const converterExchange = process.env.REACT_APP_CONVERTER_EXCHANGE!

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
    const manaAddress = process.env.REACT_APP_MANA_ADDRESS!
    return this.contractEthToToken(ethAmount, manaAddress)
  }

  async contractEthToToken(ethAmount: string, tokenAddress: string) {
    const converter = ContractFactory.build(Converter, this.converterAddress)

    return converter.methods
      .calcNeededTokensForEther(Address.fromString(tokenAddress), ethAmount)
      .call()
  }
}
