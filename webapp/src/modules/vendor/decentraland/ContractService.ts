import { ContractService as ContractServiceInterface } from '../services'
import { TransferType } from '../types'
import { nftMarketplaceAPI as nftAPI } from './nft/api'

export class ContractService implements ContractServiceInterface {
  async getContracts() {
    return [...(await nftAPI.fetchContracts())]
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
