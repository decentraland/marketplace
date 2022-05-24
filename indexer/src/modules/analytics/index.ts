import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { NFT, Sale, VolumeDayData } from '../../entities/schema'
import { createOrLoadAccount } from '../account'
import { buildCountFromSale } from '../count'
import { ONE_MILLION } from '../utils'

export let BID_SALE_TYPE = 'bid'
export let ORDER_SALE_TYPE = 'order'

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
  let count = buildCountFromSale(price)
  count.save()

  // load entities
  let nft = NFT.load(nftId)

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

  let volumeDayData = updateVolumeDayData(sale, timestamp, feesCollectorCut)
  volumeDayData.save()
}

function getOrCreateVolumeData(blockTimestamp: BigInt): VolumeDayData {
  let timestamp = blockTimestamp.toI32()
  let dayID = timestamp / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400
  let volumeDayData = VolumeDayData.load(dayID.toString())
  if (volumeDayData === null) {
    volumeDayData = new VolumeDayData(dayID.toString())
    volumeDayData.date = dayStartTimestamp // unix timestamp for start of day
    volumeDayData.dailySales = 0
    volumeDayData.dailyVolumeMANA = BigInt.fromI32(0)
    volumeDayData.dailyCreatorsEarnings = BigInt.fromI32(0) // won't be used at all, the bids and transfer from here have no fees for creators
    volumeDayData.dailyDAOEarnings = BigInt.fromI32(0)
  }
  return volumeDayData as VolumeDayData
}

export function updateVolumeDayData(
  sale: Sale,
  blockTimestamp: BigInt,
  feesCollectorCut: BigInt
): VolumeDayData {
  let volumeDayData = getOrCreateVolumeData(blockTimestamp)
  volumeDayData.dailySales += 1
  volumeDayData.dailyVolumeMANA = volumeDayData.dailyVolumeMANA.plus(sale.price)
  volumeDayData.dailyDAOEarnings = volumeDayData.dailyDAOEarnings.plus(
    feesCollectorCut.times(sale.price).div(ONE_MILLION)
  )

  return volumeDayData as VolumeDayData
}
