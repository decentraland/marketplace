import { ContractService as ContractServiceInterface } from '../services'
import { Network as ContractsNetwork } from '../../contract/types'
import { NFTCategory } from '../../nft/types'
import { TransferType } from '../types'
import { Network } from '@dcl/schemas'

const network = process.env.REACT_APP_NETWORK! as ContractsNetwork

// No Ropsten!
const contractAddresses = {
  [ContractsNetwork.ROPSTEN]: {
    DigitalMediaCore: '0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756',
    DigitalMediaCore2: '0x2d9e5de7d36f3830c010a28b29b3bdf5ca73198e',
    MarketplaceAdapter: '0xd1e4e2880ff56cd0d5c68da9bed58bfbf0150948'
  },
  [ContractsNetwork.MAINNET]: {
    DigitalMediaCore: '0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756',
    DigitalMediaCore2: '0x2d9e5de7d36f3830c010a28b29b3bdf5ca73198e',
    MarketplaceAdapter: '0xf4fbd84193f9aaf9779dedbb415a806933eb1c95'
  }
}[network]

const {
  DigitalMediaCore,
  DigitalMediaCore2,
  MarketplaceAdapter
} = contractAddresses

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  async getContractAddresses() {
    return contractAddresses
  }

  async getContractSymbols() {
    return {
      [DigitalMediaCore]: 'MakersTokenV2',
      [DigitalMediaCore2]: 'MakersTokenV2',
      [MarketplaceAdapter]: 'Partner Marketplace'
    }
  }

  async getContractNames() {
    return {
      [DigitalMediaCore]: 'MakersPlace',
      [DigitalMediaCore2]: 'MakersPlace',
      [MarketplaceAdapter]: 'BuyAdapter'
    }
  }

  async getContractCategories() {
    return {
      [DigitalMediaCore]: NFTCategory.ART,
      [DigitalMediaCore2]: NFTCategory.ART
    }
  }

  async getContractNetworks() {
    return {
      [DigitalMediaCore]: Network.ETHEREUM,
      [DigitalMediaCore2]: Network.ETHEREUM,
      [MarketplaceAdapter]: Network.ETHEREUM
    }
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
