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
  constructor() {
    const apiURL = process.env.REACT_APP_COINGECKO_API_URL!
    if (!apiURL) {
      throw new Error(`Invalid converter API URL "${apiURL}"`)
    }
    this.apiURL = apiURL
  }

  async marketEthToMANA(ethAmount: number) {
    return this.marketEthToToken(ethAmount, 'decentraland')
  }

  async marketEthToToken(
    ethAmount: number,
    coinId: string,
    exchanges: string[] = ['uniswap']
  ) {
    if (!pricesCache[coinId]) {
      pricesCache[coinId] = {}
    }

    if (!pricesCache[coinId][ethAmount]) {
      const exchangesList = exchanges.join(',')
      const response = await window.fetch(
        `${this.apiURL}/coins/${coinId}/tickers?exchange_ids=${exchangesList}`
      )
      const coinTickers: CoinTickers = await response.json()
      const uniswapTicker = coinTickers.tickers[0]

      pricesCache[coinId][ethAmount] =
        ethAmount / uniswapTicker.converted_last.eth
    }

    return pricesCache[coinId][ethAmount]
  }

  async contractEthToMANA(ethAmount: string) {
    const manaAddress = process.env.REACT_APP_MANA_ADDRESS!
    return this.contractEthToToken(ethAmount, manaAddress)
  }

  async contractEthToToken(ethAmount: string, tokenAddress: string) {
    // TODO: Network
    const converterAddress = '0x2782eb28Dcb1eF4E7632273cd4e347e130Ce4646'
    const converter = ContractFactory.build(Converter, converterAddress)

    return converter.methods
      .calcNeededTokensForEther(Address.fromString(tokenAddress), ethAmount)
      .call()
  }
}
