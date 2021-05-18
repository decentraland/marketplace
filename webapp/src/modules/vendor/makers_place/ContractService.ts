import { ChainId, Network } from '@dcl/schemas'
import {
  Contract,
  ContractService as ContractServiceInterface
} from '../services'
import { Network as AppNetwork } from '../../contract/types'
import { TransferType } from '../types'
import { NFTCategory } from '../../nft/types'

const network = process.env.REACT_APP_NETWORK! as AppNetwork

export enum ContractName {
  DIGITAL_MEDIA_CORE = 'DigitalMediaCore',
  DIGITAL_MEDIA_CORE_2 = 'DigitalMediaCore2',
  MARKETPLACE_ADAPTER = 'MarketplaceAdapter'
}

const contracts = ({
  [AppNetwork.ROPSTEN]: [],
  [AppNetwork.MAINNET]: [
    {
      name: ContractName.DIGITAL_MEDIA_CORE,
      address: '0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756',
      vendor: 'makers_place',
      category: NFTCategory.ART,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.DIGITAL_MEDIA_CORE_2,
      address: '0x2d9e5de7d36f3830c010a28b29b3bdf5ca73198e',
      vendor: 'makers_place',
      category: NFTCategory.ART,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.MARKETPLACE_ADAPTER,
      address: '0xf4fbd84193f9aaf9779dedbb415a806933eb1c95',
      vendor: 'makers_place',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    }
  ]
} as Record<AppNetwork, Contract[]>)[network]

export class ContractService implements ContractServiceInterface {
  contracts = contracts

  async build() {}

  getContracts() {
    return this.contracts
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
