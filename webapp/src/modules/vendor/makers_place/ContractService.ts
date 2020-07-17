import { ContractService as ContractServiceInterface } from '../services'
import { NFTCategory } from './nft/types'
import { TransferType } from '../types'

const env = process.env

const DigitalMediaCore = env.REACT_APP_MAKERS_PLACE_DIGITAL_MEDIA_CORE_ADDRESS!
const DigitalMediaCore2 = env.REACT_APP_MAKERS_PLACE_DIGITAL_MEDIA_CORE_2_ADDRESS!

const MarketplaceAdapter = env.REACT_APP_MARKETPLACE_ADAPTER_ADDRESS!

const contractAddresses = {
  DigitalMediaCore,
  DigitalMediaCore2,
  MarketplaceAdapter
} as const

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  contractAddresses = contractAddresses

  contractSymbols = {
    [DigitalMediaCore]: 'MakersTokenV2',
    [DigitalMediaCore2]: 'MakersTokenV2',
    [MarketplaceAdapter]: 'ThirdParty Marketplace'
  } as const

  contractNames = {
    [DigitalMediaCore]: 'MakersPlace',
    [DigitalMediaCore2]: 'MakersPlace',
    [MarketplaceAdapter]: 'MarketplaceAdapter'
  } as const

  contractCategories = {
    [DigitalMediaCore]: NFTCategory.ART,
    [DigitalMediaCore2]: NFTCategory.ART
  } as const

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
