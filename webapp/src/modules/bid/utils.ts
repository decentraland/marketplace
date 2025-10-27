import { ethers, BigNumber } from 'ethers'
import { Bid, Contract, Network, TradeAssetType, TradeCreation, TradeType } from '@dcl/schemas'
import { BidTrade } from '@dcl/schemas/dist/dapps/bid'
import { AuthorizeActionOptions } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { getNetworkProvider, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract, getContractName } from 'decentraland-transactions'
import { isErrorWithMessage } from '../../lib/error'
import { getOffChainMarketplaceContract, getTradeSignature } from '../../utils/trades'
import { Item } from '../item/types'
import { NFT } from '../nft/types'

export async function isInsufficientMANA(bid: Bid) {
  try {
    const provider = await getNetworkProvider(bid.chainId)
    const contract = getContract(ContractName.MANAToken, bid.chainId)
    const mana = new ethers.Contract(contract.address, contract.abi, new ethers.providers.Web3Provider(provider))
    const balanceRaw = (await mana.balanceOf(bid.bidder)) as BigNumber
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw))
    const price = parseFloat(ethers.utils.formatEther(bid.price))

    return balance < price
  } catch (error) {
    console.warn(isErrorWithMessage(error) ? error.message : t('global.unknown_error'))
  }
  return false
}

export function checkFingerprint(bid: Bid, fingerprint: string | undefined) {
  if (fingerprint && bid.fingerprint) {
    return fingerprint === bid.fingerprint
  }
  return true
}

export function toBidObject(bids: Bid[]) {
  return bids.reduce(
    (obj, bid) => {
      obj[bid.id] = bid
      return obj
    },
    {} as Record<string, Bid>
  )
}

export async function createBidTrade(asset: NFT | Item, price: number, expiresAt: number, fingerprint?: string): Promise<TradeCreation> {
  const signer = await getSigner()
  const address = await signer.getAddress()
  const marketplaceContract = await getOffChainMarketplaceContract(asset.chainId)
  const manaContract = getContract(ContractName.MANAToken, asset.chainId)
  const contractSignatureIndex = (await marketplaceContract.contractSignatureIndex()) as BigNumber
  const signerSignatureIndex = (await marketplaceContract.signerSignatureIndex(address)) as BigNumber

  const tradeToSign: Omit<TradeCreation, 'signature'> = {
    signer: address,
    network: asset.network,
    chainId: asset.chainId,
    type: TradeType.BID,
    checks: {
      uses: 1,
      allowedRoot: '0x',
      contractSignatureIndex: contractSignatureIndex.toNumber(),
      signerSignatureIndex: signerSignatureIndex.toNumber(),
      effective: Date.now(),
      expiration: expiresAt,
      externalChecks: [],
      salt: ethers.utils.hexlify(Math.floor(Math.random() * 1000000000000))
    },
    sent: [
      {
        assetType: TradeAssetType.ERC20,
        contractAddress: manaContract.address,
        amount: ethers.utils.parseEther(price.toString()).toString(),
        extra: ''
      }
    ],
    received: [
      {
        contractAddress: asset.contractAddress,
        extra: fingerprint || '',
        beneficiary: address,
        ...('tokenId' in asset
          ? { assetType: TradeAssetType.ERC721, tokenId: asset.tokenId }
          : { assetType: TradeAssetType.COLLECTION_ITEM, itemId: asset.itemId })
      }
    ]
  }

  return { ...tradeToSign, signature: await getTradeSignature(tradeToSign) }
}

export function isBidTrade(bid: Bid): bid is BidTrade {
  return 'tradeId' in bid
}

export function getAcceptBidAuthorizationOptions(
  bid: Bid,
  onAccept: () => void,
  targetContractLabel?: string | null
): AuthorizeActionOptions | null {
  if (!('tradeId' in bid)) {
    return null
  }

  const offchainContractName = bid.tradeContractAddress ? getContractName(bid.tradeContractAddress) : ContractName.OffChainMarketplace // if the trade doesn't have a contract address, use the default marketplace contract
  const offchainMarketplaceContract = getContract(offchainContractName, bid.chainId)
  const targetContractName = bid.network === Network.MATIC ? ContractName.ERC721CollectionV2 : ContractName.ERC721

  const authorizeActionOptions = {
    targetContractName: targetContractName,
    targetContractLabel: targetContractLabel || targetContractName,
    authorizedAddress: offchainMarketplaceContract.address,
    targetContract: {
      address: bid.contractAddress,
      chainId: bid.chainId,
      name: targetContractName,
      network: bid.network
    } as Contract,
    authorizedContractLabel: offchainMarketplaceContract.name,
    onAuthorized: onAccept
  }

  if ('tokenId' in bid) {
    return {
      ...authorizeActionOptions,
      authorizationType: AuthorizationType.APPROVAL,
      tokenId: bid.tokenId
    }
  } else {
    return {
      ...authorizeActionOptions,
      authorizationType: AuthorizationType.MINT
    }
  }
}
