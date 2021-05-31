import { ChainId, Network } from '@dcl/schemas'
import { getContract, ContractName as CN } from 'decentraland-transactions'
import {
  Contract,
  ContractService as ContractServiceInterface
} from '../services'
import { Network as AppNetwork } from '../../contract/types'
import { TransferType } from '../types'
import { nftAPI } from './nft'

const network = process.env.REACT_APP_NETWORK! as AppNetwork

export enum ContractName {
  MANA = 'MANA',
  MARKETPLACE = 'Marketplace',
  BIDS = 'Bids'
}

const contracts = ({
  [AppNetwork.ROPSTEN]: [
    {
      name: ContractName.MANA,
      address: getContract(CN.MANAToken, ChainId.ETHEREUM_ROPSTEN).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_ROPSTEN
    },
    {
      name: ContractName.MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.ETHEREUM_ROPSTEN).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_ROPSTEN
    },
    {
      name: ContractName.BIDS,
      address: getContract(CN.Bid, ChainId.ETHEREUM_ROPSTEN).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_ROPSTEN
    },
    {
      name: ContractName.MANA,
      address: getContract(CN.MANAToken, ChainId.MATIC_MUMBAI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      name: ContractName.MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.MATIC_MUMBAI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    }
  ],
  [AppNetwork.MAINNET]: [
    {
      name: ContractName.MANA,
      address: getContract(CN.MANAToken, ChainId.ETHEREUM_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.ETHEREUM_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    },
    {
      name: ContractName.BIDS,
      address: getContract(CN.Bid, ChainId.ETHEREUM_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_ROPSTEN
    },
    {
      name: ContractName.MANA,
      address: getContract(CN.MANAToken, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    },
    {
      name: ContractName.MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    }
  ]
} as Record<AppNetwork, Contract[]>)[network]

export class ContractService implements ContractServiceInterface {
  contracts = contracts

  hasFetched = false

  async build() {
    if (this.hasFetched) {
      return
    }

    const contracts = await nftAPI.fetchContracts()
    for (const contract of contracts) {
      this.contracts.push(contract)
    }

    this.hasFetched = true
  }

  getContracts() {
    return this.contracts
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
