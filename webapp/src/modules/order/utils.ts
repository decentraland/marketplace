import { addDays, format as dateFnsFormat } from 'date-fns'
import { BigNumber, ethers } from 'ethers'
import { Order, OrderFilters, TradeAssetType, TradeCreation, TradeType } from '@dcl/schemas'
import { getSigner } from 'decentraland-dapps/dist/lib'
import { ContractName, getContract } from 'decentraland-transactions'
import { getIsOrderExpired } from '../../lib/orders'
import { getOffChainMarketplaceContract, getTradeSignature } from '../../utils/trades'
import { Asset } from '../asset/types'
import { NFT } from '../nft/types'

export const DEFAULT_EXPIRATION_IN_DAYS = 30
export const INPUT_FORMAT = 'yyyy-MM-dd'
export const getDefaultExpirationDate = (date = Date.now()): string =>
  convertDateToDateInputValue(addDays(new Date(date), DEFAULT_EXPIRATION_IN_DAYS))

export const convertDateToDateInputValue = (date: Date): string => {
  return dateFnsFormat(date, INPUT_FORMAT)
}

export function isExpired(expiresAt: string) {
  return parseInt(expiresAt, 10) < Date.now()
}

export function getActiveOrder(asset: Asset | null, orders: Record<string, Order>) {
  if (
    asset &&
    'activeOrderId' in asset &&
    !!asset.activeOrderId &&
    asset.activeOrderId in orders &&
    !getIsOrderExpired(orders[asset.activeOrderId].expiresAt)
  ) {
    return orders[asset.activeOrderId]
  }
  return null
}

export function getSubgraphOrdersQuery(filters: OrderFilters) {
  const where: string[] = []

  if (filters.owner) {
    where.push(`owner: "${filters.owner}"`)
  }

  if (filters.status) {
    where.push(`status: "${filters.status}"`)
  }

  return `query orders {
    orders(where: {${where.join(',')}}) { 
      id
      marketplaceAddress
      tokenId
      price
      owner
      status
      createdAt
      expiresAt
      updatedAt
      nftAddress
      nft {
        id
        contractAddress
        tokenId
        owner {
          id
        }
        name
        image
        parcel {
          id
          x
          y
        }
        createdAt
      }
    }
  }`
}

export async function createPublicNFTOrderTrade(nft: NFT, price: number, expiresAt: number, fingerprint?: string) {
  const signer = await getSigner()
  const address = await signer.getAddress()
  const marketplaceContract = await getOffChainMarketplaceContract(nft.chainId)
  const manaContract = getContract(ContractName.MANAToken, nft.chainId)
  const contractSignatureIndex = (await marketplaceContract.contractSignatureIndex()) as BigNumber
  const signerSignatureIndex = (await marketplaceContract.signerSignatureIndex(address)) as BigNumber

  const tradeToSign: Omit<TradeCreation, 'signature'> = {
    signer: address,
    network: nft.network,
    chainId: nft.chainId,
    type: TradeType.PUBLIC_NFT_ORDER,
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
        assetType: TradeAssetType.ERC721,
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        extra: fingerprint || ''
      }
    ],
    received: [
      {
        assetType: TradeAssetType.ERC20,
        contractAddress: manaContract.address,
        amount: ethers.utils.parseEther(price.toString()).toString(),
        extra: '',
        beneficiary: address
      }
    ]
  }

  return { ...tradeToSign, signature: await getTradeSignature(tradeToSign) }
}
