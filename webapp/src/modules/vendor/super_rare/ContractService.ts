import { ChainId, Network } from '@dcl/schemas'
import { config } from '../../../config'
import { Network as AppNetwork } from '../../contract/types'
import { getContract } from '../../contract/utils'
import {
  Contract,
  ContractService as ContractServiceInterface
} from '../services'
import { TransferType } from '../types'

const network = config.get('NETWORK')! as AppNetwork

export enum ContractName {
  SUPER_RARE = 'SuperRare',
  SUPER_RARE_V2 = 'SuperRareV2',
  SUPER_RARE_MARKET = 'SuperRareMarket',
  SUPER_RARE_MARKET_V2 = 'SuperRareMarketV2',
  MARKETPLACE_ADAPTER = 'MarketplaceAdapter'
}

const contracts = ({
  [AppNetwork.ROPSTEN]: [
    {
      name: ContractName.MARKETPLACE_ADAPTER,
      address: '0xd1e4e2880ff56cd0d5c68da9bed58bfbf0150948',
      vendor: 'super_rare',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_ROPSTEN
    }
  ],
  [AppNetwork.MAINNET]: [
    {
      name: ContractName.SUPER_RARE,
      address: '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
      vendor: 'super_rare',
      category: 'art',
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.SUPER_RARE_V2,
      address: '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0',
      vendor: 'super_rare',
      category: 'art',
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.SUPER_RARE_MARKET,
      address: '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
      vendor: 'super_rare',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.SUPER_RARE_MARKET_V2,
      address: '0x2947f98c42597966a0ec25e92843c09ac17fbaa7',
      vendor: 'super_rare',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.MARKETPLACE_ADAPTER,
      address: '0xf4fbd84193f9aaf9779dedbb415a806933eb1c95',
      vendor: 'super_rare',
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

  getTransferType(address: string) {
    const contract = getContract({ address })
    if (!contract) {
      throw new Error('Invalid address: not found in contracts')
    }
    switch (contract.name) {
      case ContractName.SUPER_RARE:
        return TransferType.TRANSFER
      case ContractName.SUPER_RARE_V2:
        return TransferType.SAFE_TRANSFER_FROM
      default:
        throw new Error(
          `Invalid contract name: expected "${ContractName.SUPER_RARE}" or "${ContractName.SUPER_RARE_V2}" but got "${contract.name}" instead`
        )
    }
  }
}
