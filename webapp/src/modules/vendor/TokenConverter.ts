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

export class TokenConverter {
  async marketEthToMANA(ethAmount: number) {
    return this.marketEthToToken(ethAmount, 'decentraland')
  }

  async marketEthToToken(
    ethAmount: number,
    coinId: string,
    exchanges: string[] = ['uniswap']
  ) {
    const apiURL = process.env.REACT_APP_COINGECKO_API_URL!
    if (!apiURL) {
      throw new Error(`Invalid converter API URL "${apiURL}"`)
    }

    const response = await window.fetch(
      `${apiURL}/coins/${coinId}/tickers?exchange_ids=${exchanges.join(',')}`
    )
    const coinTickers: CoinTickers = await response.json()
    const uniswapTicker = coinTickers.tickers[0]

    return ethAmount / uniswapTicker.converted_last.eth
  }

  async contractEthToMANA(ethAmount: string) {
    const manaAddress = process.env.REACT_APP_MANA_ADDRESS!
    return this.contractEthToToken(ethAmount, manaAddress)
  }

  async contractEthToToken(ethAmount: string, tokenAddress: string) {
    const converterAddress = process.env.REACT_APP_CONVERTER_ADDRESS!
    const converter = ContractFactory.build(Converter, converterAddress)

    return converter.methods
      .calcNeededTokensForEther(Address.fromString(tokenAddress), ethAmount)
      .call()
  }
}
