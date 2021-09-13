import { Address } from 'web3x/address'
import { ABICoder } from 'web3x/contract/abi-coder'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { MarketplaceAdapter } from '../../../contracts/MarketplaceAdapter'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { TokenConverter } from '../TokenConverter'
import { MarketplacePrice } from '../MarketplacePrice'
import { getContractNames, VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'
import { ContractService } from './ContractService'
import { getContract } from '../../contract/utils'

export class OrderService
  implements OrderServiceInterface<VendorName.SUPER_RARE> {
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

  async execute(
    wallet: Wallet | null,
    nft: NFT<VendorName.SUPER_RARE>,
    order: Order
  ): Promise<string> {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }
    const contractService = new ContractService()

    const contractNames = getContractNames()

    // Addresses
    const assetContractAddress = Address.fromString(nft.contractAddress)
    const assetMarketAddress: Address = Address.fromString(order.marketAddress)
    const manaTokenAddress = Address.fromString(
      getContract({ name: contractNames.MANA }).address
    )
    const from = Address.fromString(wallet.address)

    // Data
    const calldata = this.getCallData(nft)
    const transferType = contractService.getTransferType(nft.contractAddress)

    // Price
    const manaPrice = await this.tokenConverter.contractEthToMANA(
      order.ethPrice!
    )
    const maxPrice = this.marketplacePrice.addMaxSlippage(manaPrice)

    // Contract
    const marketplaceAdapter = await ContractFactory.build(
      MarketplaceAdapter,
      getContract({ name: contractNames.MARKETPLACE_ADAPTER }).address
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

  private getCallData(nft: NFT<VendorName.SUPER_RARE>) {
    const contractNames = getContractNames()
    const superRare = getContract({ name: contractNames.SUPER_RARE })
    const superRareV2 = getContract({
      name: contractNames.SUPER_RARE_V2
    })
    const abiCoder = new ABICoder()

    switch (nft.contractAddress) {
      case superRare.address:
        return abiCoder.encodeFunctionCall(
          {
            name: 'buy',
            type: 'function',
            inputs: [{ type: 'uint256', name: 'TOKEN_ID' }]
          },
          [nft.tokenId]
        )
      case superRareV2.address:
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
      default:
        throw new Error(`Invalid SuperRare address ${nft.contractAddress}`)
    }
  }
}
