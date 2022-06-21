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
import { ContractService } from './ContractService'

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
    const assetContractAddress = nft.contractAddress
    const assetMarketAddress = order.marketplaceAddress
    const manaTokenAddress = getContract({ name: contractNames.MANA }).address
    const from = wallet.address

    // Data
    const calldata = this.getCallData(nft)
    const transferType = contractService.getTransferType(nft.contractAddress)

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
      'buy(address,uint256,address,bytes,uint256,address,uint256,uint8,address)'
    ](
      assetContractAddress,
      nft.tokenId,
      assetMarketAddress,
      calldata,
      (order as Order & { ethPrice: string }).ethPrice!,
      manaTokenAddress,
      maxPrice,
      transferType,
      from
    )
    return transaction.hash
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
    const abiCoder = ethers.utils.defaultAbiCoder

    switch (nft.contractAddress) {
      case superRare.address:
        return abiCoder.encode(['uint256'], [nft.tokenId])
      case superRareV2.address:
        return abiCoder.encode(
          ['address', 'uint256'],
          [nft.contractAddress, nft.tokenId]
        )
      default:
        throw new Error(`Invalid SuperRare address ${nft.contractAddress}`)
    }
  }
}
