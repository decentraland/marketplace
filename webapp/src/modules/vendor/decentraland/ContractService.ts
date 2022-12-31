import { ContractService as ContractServiceInterface } from '../services'
import { TransferType } from '../types'
import { nftAPI } from './nft'

export class ContractService implements ContractServiceInterface {
  async getContracts() {
    return [...(await nftAPI.fetchContracts())]
  }

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
