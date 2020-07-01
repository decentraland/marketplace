import { Address } from 'web3x-es/address'
import { ABICoder } from 'web3x-es/contract/abi-coder'

import { MarketplaceAdapter } from '../../../contracts/MarketplaceAdapter'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { ContractService as DecentralandContractService } from '../decentraland/ContractService'
import { ContractService } from './ContractService'
import { OrderService as OrderServiceInterface } from '../services'

export class OrderService implements OrderServiceInterface {
  fetchByNFT(): any {
    throw new Error('Method: `fetchByNFT` is not implemented')
  }

  create(): any {
    throw new Error('Method: `create` is not implemented')
  }

  execute(nft: NFT, order: Order, fromAddress: string): Promise<string> {
    const { contractAddresses } = ContractService

    if (!fromAddress) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const from = Address.fromString(fromAddress)

    let calldata: string
    let assetMarketAddress: Address

    const abiCoder = new ABICoder()

    if (nft.contractAddress === contractAddresses.SuperRare) {
      // V1
      calldata = abiCoder.encodeFunctionCall(
        {
          name: 'buy',
          type: 'function',
          inputs: [{ type: 'uint256', name: 'TOKEN_ID' }]
        },
        [nft.tokenId]
      )

      assetMarketAddress = Address.fromString(contractAddresses.SuperRareMarket)
    } else if (nft.contractAddress === contractAddresses.SuperRareV2) {
      calldata = abiCoder.encodeFunctionCall(
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

      assetMarketAddress = Address.fromString(
        contractAddresses.SuperRareMarketV2
      )
    } else {
      throw new Error(`Unkown contract address ${nft.contractAddress}`)
    }

    const assetContractAddress = Address.fromString(nft.contractAddress)
    const manaTokenAddress = Address.fromString(
      DecentralandContractService.contractAddresses.MANAToken
    )

    const marketplaceAdapter = ContractFactory.build(
      MarketplaceAdapter,
      contractAddresses.MarketplaceAdapter
    )
    return marketplaceAdapter.methods
      .buy(
        assetContractAddress,
        nft.tokenId,
        assetMarketAddress,
        calldata,
        order.ethPrice!.toString(),
        manaTokenAddress
      )
      .send({ from })
      .getTxHash()
  }

  cancel(): any {
    throw new Error('Method: `cancel` is not implemented')
  }
}
