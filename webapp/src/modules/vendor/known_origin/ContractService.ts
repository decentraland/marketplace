import { ContractService as ContractServiceInterface } from '../services'
import { Network } from '../../contract/types'
import { NFTCategory } from '../../nft/types'
import { TransferType } from '../types'

const network = process.env.REACT_APP_NETWORK! as Network

// No Ropsten!
const contractAddresses = {
  [Network.ROPSTEN]: {
    DigitalAsset: '0xfbeef911dc5821886e1dda71586d90ed28174b7d',
    BuyAdapter: '0xfbeef911dc5821886e1dda71586d90ed28174b7d',
    MarketplaceAdapter: '0xd1e4e2880ff56cd0d5c68da9bed58bfbf0150948'
  },
  [Network.MAINNET]: {
    DigitalAsset: '0xfbeef911dc5821886e1dda71586d90ed28174b7d',
    BuyAdapter: '0xfbeef911dc5821886e1dda71586d90ed28174b7d',
    MarketplaceAdapter: '0xf4fbd84193f9aaf9779dedbb415a806933eb1c95'
  }
}[network]

const { DigitalAsset, MarketplaceAdapter } = contractAddresses

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  contractAddresses = contractAddresses

  contractSymbols = {
    [DigitalAsset]: 'KnownOriginDigitalAssetV2',
    [MarketplaceAdapter]: 'Partner Marketplace'
  } as const

  contractNames = {
    [DigitalAsset]: 'KnownOrigin',
    [MarketplaceAdapter]: 'Partner Marketplace'
  } as const

  contractCategories = {
    [DigitalAsset]: NFTCategory.ART
  } as const

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
