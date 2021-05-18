import { Address } from 'web3x-es/address'
import { ABICoder } from 'web3x-es/contract/abi-coder'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { MarketplaceAdapter } from '../../../contracts/MarketplaceAdapter'
import { ContractFactory } from '../../contract/ContractFactory'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { TokenConverter } from '../TokenConverter'
import { MarketplacePrice } from '../MarketplacePrice'
import { getContractNames, VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'
import { getContract } from '../../contract/utils'

export class OrderService
  implements OrderServiceInterface<VendorName.KNOWN_ORIGIN> {
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
    nft: NFT<VendorName.KNOWN_ORIGIN>,
    order: Order
  ): Promise<string> {
    if (!wallet) {
      throw new Error('Invalid address. Wallet must be connected.')
    }

    const contractNames = getContractNames()

    // Addresses
    const assetMarketAddress: Address = Address.fromString(order.marketAddress)
    const manaTokenAddress = Address.fromString(
      getContract({ name: contractNames.MANA }).address
    )
    const from = Address.fromString(wallet.address)

    // Data
    const calldata = this.getCallData(wallet.address, nft)

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
        assetMarketAddress,
        calldata,
        order.ethPrice!,
        manaTokenAddress,
        maxPrice
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

  private getCallData(to: string, nft: NFT<VendorName.KNOWN_ORIGIN>) {
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
