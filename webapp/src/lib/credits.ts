import { ethers } from 'ethers'
import { ChainId, Network, Order, Trade, TradeAssetType } from '@dcl/schemas'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { Credit } from '../modules/credits/types'
import { Item } from '../modules/item/types'
import { NFT } from '../modules/nft/types'
import { getOnChainTrade } from '../utils/trades'

type CreditsData = {
  value: string
  expiresAt: number
  salt: string
}

export type UseCreditsArgs = {
  credits: {
    value: string
    expiresAt: number
    salt: string
  }[]
  creditsSignatures: string[]
  externalCall: {
    target: string
    selector: string
    data: string
    expiresAt: number
    salt: string
  }
  customExternalCallSignature: string
  maxUncreditedValue: string | number
  maxCreditedValue: string | number
}

export type ExternalCallParams = {
  target: string
  selector: string
  data: string
}

export class CreditsService {
  /**
   * Prepares common credits data and gets the CreditsManager contract
   * @param credits - The user's credits
   * @param chainId - The chain ID
   * @returns Object containing the contract, creditsData, and creditsSignatures
   */
  private prepareCreditsData(
    credits: Credit[],
    chainId: ChainId | string | number
  ): {
    contract: ContractData
    creditsData: CreditsData[]
    creditsSignatures: string[]
  } {
    // Get the CreditsManager contract
    const contract = getContract(ContractName.CreditsManager, chainId as ChainId)

    // Prepare the credits data
    const creditsData = credits.map(credit => {
      // Make sure the salt is a valid bytes32 value
      let salt = ''
      if (credit.id) {
        if (!credit.id.startsWith('0x')) {
          // If it's not a hex string, convert it to one
          salt = ethers.utils.hexZeroPad('0x' + Buffer.from(credit.id).toString('hex'), 32)
        } else {
          // If it's already a hex string, ensure it's 32 bytes
          salt = ethers.utils.hexZeroPad(credit.id, 32)
        }
      }

      return {
        value: credit.amount,
        expiresAt: parseInt(credit.expiresAt),
        salt
      }
    })

    // Prepare the signatures
    const creditsSignatures = credits.map(credit => credit.signature)

    return { contract, creditsData, creditsSignatures }
  }

  /**
   * Prepares the external call parameters
   * @param params - The external call parameters
   * @returns The external call object
   */
  private prepareExternalCall({ target, selector, data }: ExternalCallParams) {
    // Set expiration time (can be adjusted as needed)
    const expiresAt = Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours from now

    // Random salt for the external call
    const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32))

    // Prepare the external call
    return {
      target,
      selector,
      data,
      expiresAt,
      salt
    }
  }

  /**
   * Executes the useCredits transaction
   * @param contract - The CreditsManager contract
   * @param creditsData - The prepared credits data
   * @param creditsSignatures - The prepared credits signatures
   * @param externalCall - The external call object
   * @param maxCreditedValue - The maximum amount of MANA that can be credited
   * @returns The transaction hash
   */
  private async executeUseCredits(
    contract: ContractData,
    creditsData: CreditsData[],
    creditsSignatures: string[],
    externalCall: ExternalCallParams,
    maxCreditedValue: string | number,
    maxUncreditedValue: string | number
  ): Promise<string> {
    // Prepare the UseCreditsArgs
    const useCreditsArgs = {
      credits: creditsData,
      creditsSignatures,
      externalCall,
      customExternalCallSignature: '0x', // Empty since we're not using a custom external call
      maxUncreditedValue,
      maxCreditedValue
    }
    // Send the transaction
    return sendTransaction(contract, 'useCredits', useCreditsArgs)
  }

  prepareCreditsCollectionStore(
    item: Item,
    walletAddress: string,
    credits: Credit[]
  ): {
    contract: ContractData
    creditsData: CreditsData[]
    creditsSignatures: string[]
    externalCall: ExternalCallParams
    maxUncreditedValue: string
    maxCreditedValue: string
  } {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, item.chainId)

    // Get the CollectionStore contract address
    const collectionStoreContract = getContract(ContractName.CollectionStore, item.chainId)
    const collectionStoreAddress = collectionStoreContract.address

    // Create a contract interface for the CollectionStore to get the function selector
    const collectionStoreInterface = new ethers.utils.Interface(collectionStoreContract.abi)

    // The selector for the buy function in the CollectionStore contract
    const buySelector = collectionStoreInterface.getSighash('buy')

    // Create the ItemToBuy structure as shown in the tests
    const itemsToBuy = [
      {
        collection: item.contractAddress,
        ids: [item.itemId],
        prices: [item.price],
        beneficiaries: [walletAddress]
      }
    ]

    // Encode the buy function parameters using abi.encode
    const buyData = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address collection, uint256[] ids, uint256[] prices, address[] beneficiaries)[]'],
      [itemsToBuy]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: collectionStoreAddress,
      selector: buySelector,
      data: buyData
      // chainId: item.chainId
    })

    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(item.price) - BigInt(creditsValue)
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()

    return {
      contract,
      creditsData,
      creditsSignatures,
      externalCall,
      maxUncreditedValue,
      maxCreditedValue: item.price
    }
  }

  /**
   * Use credits for buying items from the CollectionStore
   * @param item - The item to buy
   * @param walletAddress - The user's wallet address
   * @param credits - The user's credits
   * @returns The transaction hash
   */
  async useCreditsCollectionStore(item: Item, walletAddress: string, credits: Credit[]): Promise<string> {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, item.chainId)

    // Get the CollectionStore contract address
    const collectionStoreContract = getContract(ContractName.CollectionStore, item.chainId)
    const collectionStoreAddress = collectionStoreContract.address

    // Create a contract interface for the CollectionStore to get the function selector
    const collectionStoreInterface = new ethers.utils.Interface(collectionStoreContract.abi)

    // The selector for the buy function in the CollectionStore contract
    const buySelector = collectionStoreInterface.getSighash('buy')

    // Create the ItemToBuy structure as shown in the tests
    const itemsToBuy = [
      {
        collection: item.contractAddress,
        ids: [item.itemId],
        prices: [item.price],
        beneficiaries: [walletAddress]
      }
    ]

    // Encode the buy function parameters using abi.encode
    const buyData = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address collection, uint256[] ids, uint256[] prices, address[] beneficiaries)[]'],
      [itemsToBuy]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: collectionStoreAddress,
      selector: buySelector,
      data: buyData
    })

    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(item.price) - BigInt(creditsValue)
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()

    // Execute the transaction
    return this.executeUseCredits(contract, creditsData, creditsSignatures, externalCall, item.price, maxUncreditedValue)
  }

  prepareCreditsMarketplace(
    trade: Trade,
    walletAddress: string,
    credits: Credit[]
  ): {
    contract: ContractData
    creditsData: CreditsData[]
    creditsSignatures: string[]
    externalCall: ExternalCallParams
    maxUncreditedValue: string
    maxCreditedValue: string
  } {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, trade.chainId)

    // Get the OffChainMarketplace contract address
    const marketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const marketplaceAddress = marketplaceContract.address

    // Create a contract interface for the OffChainMarketplace to get the function selector
    const marketplaceInterface = new ethers.utils.Interface(marketplaceContract.abi)

    // The selector for the accept function in the OffChainMarketplace contract
    const acceptSelector = marketplaceInterface.getSighash('accept')
    const onChainTrade = getOnChainTrade(trade, walletAddress)
    console.log('onChainTrade', onChainTrade) // TODO: remove

    // Encode the accept function parameters based on the correct ABI
    const acceptData = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(address signer, bytes signature, tuple(uint256 uses, uint256 expiration, uint256 effective, bytes32 salt, uint256 contractSignatureIndex, uint256 signerSignatureIndex, bytes32 allowedRoot, bytes32[] allowedProof, tuple(address contractAddress, bytes4 selector, bytes value, bool required)[] externalChecks) checks, tuple(uint256 assetType, address contractAddress, uint256 value, address beneficiary, bytes extra)[] sent, tuple(uint256 assetType, address contractAddress, uint256 value, address beneficiary, bytes extra)[] received)[]'
      ],
      [[onChainTrade]]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: marketplaceAddress,
      selector: acceptSelector,
      data: acceptData
      // chainId: trade.chainId
    })

    // Get the trade price
    // Execute the transaction
    // const tradePrice = (trade.received[0] as ERC20TradeAsset).amount
    const tradePrice = this.getTradePrice(trade)
    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(tradePrice) - BigInt(creditsValue)
    console.log('whatUserHasToPay', whatUserHasToPay) // TODO: remove
    console.log('tradePrice', tradePrice) // TODO: remove
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()

    return {
      contract,
      creditsData,
      creditsSignatures,
      externalCall,
      maxUncreditedValue,
      maxCreditedValue: tradePrice
    }
  }

  /**
   * Use credits for buying NFTs from the Marketplace (using trades)
   * @param trade - The trade to accept
   * @param walletAddress - The user's wallet address
   * @param credits - The user's credits
   * @returns The transaction hash
   */
  async useCreditsMarketplace(trade: Trade, walletAddress: string, credits: Credit[]): Promise<string> {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, trade.chainId)

    // Get the OffChainMarketplace contract address
    const marketplaceContract = getContract(ContractName.OffChainMarketplace, trade.chainId)
    const marketplaceAddress = marketplaceContract.address

    // Create a contract interface for the OffChainMarketplace to get the function selector
    const marketplaceInterface = new ethers.utils.Interface(marketplaceContract.abi)

    // The selector for the accept function in the OffChainMarketplace contract
    const acceptSelector = marketplaceInterface.getSighash('accept')
    const onChainTrade = getOnChainTrade(trade, walletAddress)
    console.log('onChainTrade', onChainTrade) // TODO: remove

    // Encode the accept function parameters based on the correct ABI
    const acceptData = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(address signer, bytes signature, tuple(uint256 uses, uint256 expiration, uint256 effective, bytes32 salt, uint256 contractSignatureIndex, uint256 signerSignatureIndex, bytes32 allowedRoot, bytes32[] allowedProof, tuple(address contractAddress, bytes4 selector, bytes value, bool required)[] externalChecks) checks, tuple(uint256 assetType, address contractAddress, uint256 value, address beneficiary, bytes extra)[] sent, tuple(uint256 assetType, address contractAddress, uint256 value, address beneficiary, bytes extra)[] received)[]'
      ],
      [[onChainTrade]]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: marketplaceAddress,
      selector: acceptSelector,
      data: acceptData
      // chainId: trade.chainId
    })

    // Get the trade price
    // Execute the transaction
    // const tradePrice = (trade.received[0] as ERC20TradeAsset).amount
    const tradePrice = this.getTradePrice(trade)
    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(tradePrice) - BigInt(creditsValue)
    console.log('whatUserHasToPay', whatUserHasToPay) // TODO: remove
    console.log('tradePrice', tradePrice) // TODO: remove
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()
    return this.executeUseCredits(contract, creditsData, creditsSignatures, externalCall, tradePrice, maxUncreditedValue)
  }

  prepareCreditsLegacyMarketplace(
    nft: NFT,
    order: Order,
    credits: Credit[]
  ): {
    contract: ContractData
    creditsData: CreditsData[]
    creditsSignatures: string[]
    externalCall: ExternalCallParams
    maxUncreditedValue: string
    maxCreditedValue: string
  } {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, nft.chainId)

    console.log('creditsData', creditsData) // TODO: remove
    console.log('creditsSignatures', creditsSignatures) // TODO: remove

    // Get the Marketplace contract address
    // const marketplaceContract = getContract(ContractName.Marketplace, nft.chainId)
    const marketplaceContract = getContract(
      nft.network === Network.ETHEREUM ? ContractName.Marketplace : ContractName.MarketplaceV2,
      nft.chainId
    )
    const marketplaceAddress = marketplaceContract.address

    // Create a contract interface for the Marketplace to get the function selector
    const marketplaceInterface = new ethers.utils.Interface(marketplaceContract.abi)

    // The selector for the executeOrder function in the Marketplace contract
    const executeOrderSelector = marketplaceInterface.getSighash('executeOrder')

    // Encode the executeOrder function parameters
    const executeOrderData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256'],
      [nft.contractAddress, nft.tokenId, order.price]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: marketplaceAddress,
      selector: executeOrderSelector,
      data: executeOrderData
      // chainId: nft.chainId
    })

    console.log('externalCall', externalCall)
    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(order.price) - BigInt(creditsValue)
    console.log('whatUserHasToPay', whatUserHasToPay)
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()
    console.log('maxUncreditedValue', maxUncreditedValue)

    return {
      contract,
      creditsData,
      creditsSignatures,
      externalCall,
      maxUncreditedValue,
      maxCreditedValue: order.price
    }
  }

  /**
   * Use credits for buying NFTs from the Legacy Marketplace
   * @param nft - The NFT to buy
   * @param order - The order to execute
   * @param credits - The user's credits
   * @returns The transaction hash
   */
  async useCreditsLegacyMarketplace(nft: NFT, order: Order, credits: Credit[]): Promise<string> {
    // Prepare common credits data
    const { contract, creditsData, creditsSignatures } = this.prepareCreditsData(credits, nft.chainId)

    console.log('creditsData', creditsData) // TODO: remove
    console.log('creditsSignatures', creditsSignatures) // TODO: remove

    // Get the Marketplace contract address
    // const marketplaceContract = getContract(ContractName.Marketplace, nft.chainId)
    const marketplaceContract = getContract(
      nft.network === Network.ETHEREUM ? ContractName.Marketplace : ContractName.MarketplaceV2,
      nft.chainId
    )
    const marketplaceAddress = marketplaceContract.address

    // Create a contract interface for the Marketplace to get the function selector
    const marketplaceInterface = new ethers.utils.Interface(marketplaceContract.abi)

    // The selector for the executeOrder function in the Marketplace contract
    const executeOrderSelector = marketplaceInterface.getSighash('executeOrder')

    // Encode the executeOrder function parameters
    const executeOrderData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256'],
      [nft.contractAddress, nft.tokenId, order.price]
    )

    // Prepare the external call
    const externalCall = this.prepareExternalCall({
      target: marketplaceAddress,
      selector: executeOrderSelector,
      data: executeOrderData
      // chainId: nft.chainId
    })

    console.log('externalCall', externalCall)
    const creditsValue = credits.reduce((acc, credit) => acc + parseInt(credit.amount), 0)
    const whatUserHasToPay = BigInt(order.price) - BigInt(creditsValue)
    console.log('whatUserHasToPay', whatUserHasToPay)
    const maxUncreditedValue = whatUserHasToPay < BigInt(0) ? '0' : whatUserHasToPay.toString()
    console.log('maxUncreditedValue', maxUncreditedValue)
    // Execute the transaction
    return this.executeUseCredits(contract, creditsData, creditsSignatures, externalCall, order.price, maxUncreditedValue)
  }

  /**
   * Helper method to get the price of a trade
   * @param trade - The trade to get the price from
   * @returns The trade price
   */
  private getTradePrice(trade: Trade): string {
    // Find the ERC20 asset in the received array (this is the payment)
    const paymentAsset = trade.received.find(asset => asset.assetType === TradeAssetType.ERC20)
    if (paymentAsset && 'amount' in paymentAsset) {
      return paymentAsset.amount
    }
    return '0'
  }
}

export default new CreditsService()
