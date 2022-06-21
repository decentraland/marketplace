import { ethers } from 'ethers'
import { Order } from '@dcl/schemas'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { MarketplaceAdapter__factory } from '../../../contracts'
import { getContract } from '../../contract/utils'
import { NFT } from '../../nft/types'
import { TokenConverter } from '../TokenConverter'
import { MarketplacePrice } from '../MarketplacePrice'
import { getContractNames, VendorName } from '../types'
import { OrderService as OrderServiceInterface } from '../services'

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
    const assetMarketAddress = order.marketplaceAddress
    const manaTokenAddress = getContract({ name: contractNames.MANA }).address

    // Data
    const calldata = this.getCallData(wallet.address, nft)

    // Price
    const manaPrice = await this.tokenConverter.contractEthToMANA(
      (order as Order & { ethPrice: string }).ethPrice!
    )
    const maxPrice = this.marketplacePrice.addMaxSlippage(manaPrice)

    // Contract
    const marketplaceAdapter = MarketplaceAdapter__factory.connect(
      getContract({ name: contractNames.MARKETPLACE_ADAPTER }).address,
      await getSigner()
    )

    const transaction = await marketplaceAdapter[
      'buy(address,bytes,uint256,address,uint256)'
    ](
      assetMarketAddress,
      calldata,
      (order as Order & { ethPrice: string }).ethPrice!,
      manaTokenAddress,
      maxPrice
    )

    return transaction.hash
  }

  cancel(): any {
    throw new Error('Method: `cancel` is not implemented')
  }

  canSell() {
    return false
  }

  private getCallData(to: string, nft: NFT<VendorName.KNOWN_ORIGIN>) {
    const abiCoder = ethers.utils.defaultAbiCoder
    // purchaseTo
    return abiCoder.encode(['address', 'uint256'], [to, nft.tokenId])
  }
}
