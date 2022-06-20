import { BigInt } from '@graphprotocol/graph-ts'
import { NFT, Order, Count } from '../../entities/schema'
import * as categories from '../category/categories'
import { ONE_MILLION } from '../utils'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.orderTotal = 0
    count.orderParcel = 0
    count.orderEstate = 0
    count.orderWearable = 0
    count.orderENS = 0
    count.parcelTotal = 0
    count.estateTotal = 0
    count.wearableTotal = 0
    count.ensTotal = 0
    count.started = 0
    count.salesTotal = 0
    count.salesManaTotal = BigInt.fromI32(0)
    count.creatorEarningsManaTotal = BigInt.fromI32(0)
    count.daoEarningsManaTotal = BigInt.fromI32(0)
  }

  return count as Count
}

export function buildCountFromNFT(nft: NFT): Count {
  let category = nft.category
  let count = buildCount()

  if (category == categories.PARCEL) {
    count.parcelTotal += 1
  } else if (category == categories.ESTATE) {
    count.estateTotal += 1
  } else if (category == categories.WEARABLE) {
    count.wearableTotal += 1
  } else if (category == categories.ENS) {
    count.ensTotal += 1
  }

  return count
}

export function buildCountFromOrder(order: Order): Count {
  let category = order.category
  let count = buildCount()
  count.orderTotal += 1

  if (category == categories.PARCEL) {
    count.orderParcel += 1
  } else if (category == categories.ESTATE) {
    count.orderEstate += 1
  } else if (category == categories.WEARABLE) {
    count.orderWearable += 1
  } else if (category == categories.ENS) {
    count.orderENS += 1
  }
  return count
}

export function buildCountFromSale(
  price: BigInt,
  feesCollectorCut: BigInt
): Count {
  let count = buildCount()
  count.salesTotal += 1
  count.salesManaTotal = count.salesManaTotal.plus(price)
  count.daoEarningsManaTotal = count.daoEarningsManaTotal.plus(
    feesCollectorCut.times(price).div(ONE_MILLION)
  )
  return count
}
