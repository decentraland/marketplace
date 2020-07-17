import { Address } from 'web3x-es/address'
import { ABICoder } from 'web3x-es/contract/abi-coder'

import { MarketplaceAdapter } from '../../../contracts/MarketplaceAdapter'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { TokenConverter } from '../TokenConverter'
import { MarketplacePrice } from '../MarketplacePrice'
import { ContractService as DecentralandContractService } from '../decentraland/ContractService'
import { OrderService as OrderServiceInterface } from '../services'
import { ContractService } from './ContractService'

export class OrderService implements OrderServiceInterface {
  private tokenConverter: TokenConverter
  private marketplacePrice: MarketplacePrice

  constructor() {
    this.tokenConverter = new TokenConverter()
    this.marketplacePrice = new MarketplacePrice()
  }

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
    const contractService = new ContractService()

    // Addresses
    const assetContractAddress = Address.fromString(nft.contractAddress)
    const assetMarketAddress: Address = Address.fromString(order.marketAddress)
    const manaTokenAddress = Address.fromString(
      DecentralandContractService.contractAddresses.MANAToken
    )
    const from = Address.fromString(fromAddress)

    // Data
    const calldata = this.getCallData(nft)
    const transferType = contractService.getTransferType(nft.contractAddress)

    // Price
    const manaPrice = await this.tokenConverter.contractEthToMANA(
      order.ethPrice!
    )
    const maxPrice = this.marketplacePrice.addMaxSlippage(manaPrice)

    // Contract
    const marketplaceAdapter = ContractFactory.build(
      MarketplaceAdapter,
      ContractService.contractAddresses.MarketplaceAdapter
    )
    return marketplaceAdapter.methods
      .buy(
        assetContractAddress,
        nft.tokenId,
        assetMarketAddress,
        calldata,
        order.ethPrice!,
        manaTokenAddress,
        maxPrice,
        transferType,
        from
      )
      .send({ from })
      .getTxHash()
  }

  cancel(): any {
    throw new Error('Method: `cancel` is not implemented')
  }

  canSell() {
    return false
  }

  private getCallData(nft: NFT) {
    const abiCoder = new ABICoder()
    return abiCoder.encodeFunctionCall(
      {
        name: 'buy',
        type: 'function',
        inputs: [
          { type: 'address', name: 'ADDRESS_CONTRACT' },
          { type: 'uint256', name: 'TOKEN_ID' }
        ]
      },
      [nft.contractAddress, nft.tokenId]
    )
  }
}
