import { ChainId, Network } from '@dcl/schemas'
import { getContract, ContractName as CN } from 'decentraland-transactions'
import {
  Contract,
  ContractService as ContractServiceInterface
} from '../services'
import { Network as AppNetwork } from '../../contract/types'
import { TransferType } from '../types'
import { nftAPI } from './nft'
import { config } from '../../../config'

const network = config.get('NETWORK')! as AppNetwork

export enum ContractName {
  MANA = 'MANA',
  MARKETPLACE = 'Marketplace',
  LEGACY_MARKETPLACE = 'LegacyMarketplace',
  BIDS = 'Bids',
  COLLECTION_STORE = 'CollectionStore',
  RENTALS = 'Rentals'
}

const contracts = ({
  [AppNetwork.GOERLI]: [
    {
      name: ContractName.MANA,
      address: getContract(CN.MANAToken, ChainId.ETHEREUM_GOERLI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_GOERLI
    },
    {
      name: ContractName.MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.ETHEREUM_GOERLI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_GOERLI
    },
    {
      name: ContractName.BIDS,
      address: getContract(CN.Bid, ChainId.ETHEREUM_GOERLI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_GOERLI
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
      address: getContract(CN.MarketplaceV2, ChainId.MATIC_MUMBAI).address,
      label: 'MarketplaceV2',
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      name: ContractName.LEGACY_MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.MATIC_MUMBAI).address,
      label: 'MarketplaceV1',
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      name: CN.CollectionStore,
      address: getContract(CN.CollectionStore, ChainId.MATIC_MUMBAI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      name: ContractName.BIDS,
      address: getContract(CN.BidV2, ChainId.MATIC_MUMBAI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      name: ContractName.RENTALS,
      address: getContract(CN.Rentals, ChainId.ETHEREUM_GOERLI).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_GOERLI
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
      chainId: ChainId.ETHEREUM_MAINNET
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
      address: getContract(CN.MarketplaceV2, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    },
    {
      name: ContractName.LEGACY_MARKETPLACE,
      address: getContract(CN.Marketplace, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    },
    {
      name: CN.CollectionStore,
      address: getContract(CN.CollectionStore, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    },
    {
      name: ContractName.BIDS,
      address: getContract(CN.BidV2, ChainId.MATIC_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET
    },
    {
      name: ContractName.RENTALS,
      address: getContract(CN.Rentals, ChainId.ETHEREUM_MAINNET).address,
      vendor: 'decentraland',
      category: null,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET
    }
  ]
} as Record<AppNetwork, Contract[]>)[network]

export class ContractService implements ContractServiceInterface {
  async getContracts() {
    return [...contracts, ...(await nftAPI.fetchContracts())]
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
