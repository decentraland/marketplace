import { ContractService as ContractServiceInterface } from '../services'
import { NFTCategory } from './nft/types'
import { TransferType } from '../types'

const env = process.env

const SuperRare = env.REACT_APP_SUPER_RARE_ADDRESS!
const SuperRareV2 = env.REACT_APP_SUPER_RARE_V2_ADDRESS!

const SuperRareMarket = env.REACT_APP_SUPER_RARE_MARKET_ADDRESS!
const SuperRareMarketV2 = env.REACT_APP_SUPER_RARE_MARKET_V2_ADDRESS!

const MarketplaceAdapter = env.REACT_APP_MARKETPLACE_ADAPTER_ADDRESS!

const contractAddresses = {
  SuperRare,
  SuperRareV2,
  SuperRareMarket,
  SuperRareMarketV2,
  MarketplaceAdapter
} as const

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  contractAddresses = contractAddresses

  contractSymbols = {
    [SuperRare]: 'SR',
    [SuperRareV2]: 'SR',
    [MarketplaceAdapter]: 'ThirdParty Marketplace'
  } as const

  contractNames = {
    [SuperRare]: 'SuperRare',
    [SuperRareV2]: 'SuperRareV2',
    [MarketplaceAdapter]: 'MarketplaceAdapter'
  } as const

  contractCategories = {
    [SuperRare]: NFTCategory.ART,
    [SuperRareV2]: NFTCategory.ART
  } as const

  getTransferType(address: string) {
    switch (address) {
      case SuperRare:
        return TransferType.TRANSFER
      case SuperRareV2:
        return TransferType.SAFE_TRANSFER_FROM
      default:
        throw new Error(`Invalid SuperRare address ${address}`)
    }
  }
}
