import { Address } from 'web3x-es/address'
import { ABICoder } from 'web3x-es/contract/abi-coder'

import { MarketplaceAdapter } from '../../../contracts/MarketplaceAdapter'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { OrderService as OrderServiceInterface } from '../services'
import { ContractService } from './ContractService'

export class OrderService implements OrderServiceInterface {
  fetchByNFT(): any {
    throw new Error('Method: `fetchByNFT` is not implemented')
  }

  create(): any {
    throw new Error('Method: `create` is not implemented')
  }

  async execute(nft: NFT, order: Order, fromAddress: string): Promise<string> {
    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    // Addresses
    const assetMarketAddress: Address = Address.fromString(order.marketAddress)
    const from = Address.fromString(fromAddress)

    // Data
    const calldata = this.getCallData(fromAddress, nft)

    // Contract
    const marketplaceAdapter = ContractFactory.build(
      MarketplaceAdapter,
      ContractService.contractAddresses.MarketplaceAdapter
    )
    return marketplaceAdapter.methods
      .buy(assetMarketAddress, calldata, order.ethPrice!)
      .send({ from })
      .getTxHash()
  }

  cancel(): any {
    throw new Error('Method: `cancel` is not implemented')
  }

  canSell() {
    return false
  }

  private getCallData(to: string, nft: NFT) {
    const abiCoder = new ABICoder()
    return abiCoder.encodeFunctionCall(
      {
        name: 'purchaseTo',
        type: 'function',
        inputs: [
          { type: 'address', name: '_to' },
          { type: 'uint256', name: '_editionNumber' }
        ]
      },
      [to, nft.tokenId]
    )
  }
}
