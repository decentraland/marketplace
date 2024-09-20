import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { NFT, Sale, AnalyticsDayData } from '../../entities/schema'
import { ERC721 } from '../../entities/templates/ERC721/ERC721'
import { createOrLoadAccount } from '../account'
import { buildCountFromSale } from '../count'
import { ONE_MILLION } from '../utils'

export let BID_SALE_TYPE = 'bid'
export let ORDER_SALE_TYPE = 'order'

// check if the buyer in a sale was a third party provider (to pay with credit card, cross chain, etc)
export function isThirdPartySale(buyer: string): boolean {
  if (
    buyer == '0xed038688ecf1193f8d9717eb3930f0bf0d745cb4' || // Transak Polygon
    buyer == '0xea749fd6ba492dbc14c24fe8a3d08769229b896c' // Axelar Polygon & Ethereum
  ) {
    return true
  }
  return false
}

export function trackSale(
  type: string,
  buyer: Address,
  seller: Address,
  nftId: string,
  price: BigInt,
  feesCollectorCut: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // ignore zero price sales
  if (price.isZero()) {
    return
  }

  // count sale
  let count = buildCountFromSale(price, feesCollectorCut)
  count.save()

  // load entities
  let nft = NFT.load(nftId)
  if (!nft) {
    return
  }

  // check if the buyer is a third party and update it if so
  if (isThirdPartySale(buyer.toHexString())) {
    let erc721 = ERC721.bind(Address.fromString(nft.contractAddress.toHex()))
    buyer = erc721.ownerOf(nft.tokenId)
  }

  // save sale
  let saleId = BigInt.fromI32(count.salesTotal).toString()
  let sale = new Sale(saleId)
  sale.type = type
  sale.buyer = buyer
  sale.seller = seller
  sale.price = price
  sale.nft = nftId
  sale.timestamp = timestamp
  sale.txHash = txHash
  sale.searchTokenId = nft.tokenId
  sale.searchContractAddress = nft.contractAddress
  sale.searchCategory = nft.category
  sale.save()

  // update buyer account
  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  buyerAccount.save()

  // update seller account
  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price)
  sellerAccount.save()

  // update nft
  nft.soldAt = timestamp
  nft.sales += 1
  nft.volume = nft.volume.plus(price)
  nft.updatedAt = timestamp
  nft.save()

  let analyticsDayData = updateAnalyticsDayData(sale, feesCollectorCut)
  analyticsDayData.save()
}

export function getOrCreateAnalyticsDayData(
  blockTimestamp: BigInt
): AnalyticsDayData {
  let timestamp = blockTimestamp.toI32()
  let dayID = timestamp / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400
  let analyticsDayData = AnalyticsDayData.load(dayID.toString())
  if (analyticsDayData == null) {
    analyticsDayData = new AnalyticsDayData(dayID.toString())
    analyticsDayData.date = dayStartTimestamp // unix timestamp for start of day
    analyticsDayData.sales = 0
    analyticsDayData.volume = BigInt.fromI32(0)
    analyticsDayData.creatorsEarnings = BigInt.fromI32(0) // won't be used at all, the bids and transfer from here have no fees for creators
    analyticsDayData.daoEarnings = BigInt.fromI32(0)
  }
  return analyticsDayData as AnalyticsDayData
}

export function updateAnalyticsDayData(
  sale: Sale,
  feesCollectorCut: BigInt
): AnalyticsDayData {
  let analyticsDayData = getOrCreateAnalyticsDayData(sale.timestamp)
  analyticsDayData.sales += 1
  analyticsDayData.volume = analyticsDayData.volume.plus(sale.price)
  analyticsDayData.daoEarnings = analyticsDayData.daoEarnings.plus(
    feesCollectorCut.times(sale.price).div(ONE_MILLION)
  )

  return analyticsDayData as AnalyticsDayData
}
