import { ContractService as ContractServiceInterface } from '../services'
import { Network } from '../../contract/types'
import { TransferType } from '../types'
import { NFTCategory } from './nft/types'

const network = process.env.REACT_APP_NETWORK! as Network

const contractAddresses = {
  [Network.ROPSTEN]: {
    SuperRare: '0xa42e14b40bb22bc3daaf8ecad9d73bdf44056959',
    SuperRareV2: '0x84691657fd6bcf50764d9fef2a53b22c8bd2202e',
    SuperRareMarket: '0xa42e14b40bb22bc3daaf8ecad9d73bdf44056959',
    SuperRareMarketV2: '0x17d0234dc57ef236cdfc4fda76b0810265f44e1f',
    MarketplaceAdapter: '0x8512Fc051B3f8A3A5043F93278DEFe1389E2668C'
  },
  [Network.MAINNET]: {
    SuperRare: '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
    SuperRareV2: '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0',
    SuperRareMarket: '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
    SuperRareMarketV2: '0x2947f98c42597966a0ec25e92843c09ac17fbaa7',
    MarketplaceAdapter: '0x20e66474bb6178f32925b8ac27043d0e6d542b6f'
  }
}[network]

const { SuperRare, SuperRareV2, MarketplaceAdapter } = contractAddresses

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
