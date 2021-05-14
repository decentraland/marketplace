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
  DIGITAL_ASSET = 'DigitalAssset',
  MARKETPLACE_ADAPTER = 'MarketplaceAdapter'
}

const contracts = ({
  [AppNetwork.ROPSTEN]: [],
  [AppNetwork.MAINNET]: [
    {
      name: ContractName.DIGITAL_ASSET,
      address: '0xfbeef911dc5821886e1dda71586d90ed28174b7d',
      vendor: 'known_origin',
      category: NFTCategory.ART,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.MARKETPLACE_ADAPTER,
      address: '0xf4fbd84193f9aaf9779dedbb415a806933eb1c95',
      vendor: 'known_origin',
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
