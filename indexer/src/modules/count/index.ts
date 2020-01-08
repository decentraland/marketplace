import { NFT, Count } from '../../entities/schema'
import * as addresses from '../../data/addresses'
import * as categories from '../category/categories'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.order_total = 0
    count.order_parcel = 0
    count.order_estate = 0
    count.order_wearable = 0

    count.parcel_total = 0

    count.estate_total = 0

    count.wearable_total = 0
    count.wearable_halloween_2019 = 0
    count.wearable_exclusive_masks = 0
    count.wearable_xmas_2019 = 0
  }

  return count as Count
}

export function buildCountFromNFT(nft: NFT): Count {
  let category = nft.category
  let contractAddress = nft.contractAddress.toHexString()
  let count = buildCount()

  if (category == categories.PARCEL) {
    count.parcel_total += 1
  } else if (category == categories.ESTATE) {
    count.estate_total += 1
  } else if (nft.category == categories.WEARABLE) {
    count.wearable_total += 1

    if (contractAddress == addresses.Halloween2019Collection) {
      count.wearable_halloween_2019 += 1
    } else if (contractAddress == addresses.ExclusiveMasksCollection) {
      count.wearable_exclusive_masks += 1
    } else if (contractAddress == addresses.Xmas2019Collection) {
      count.wearable_xmas_2019 += 1
    }
  } else if (contractAddress == addresses.Marketplace) {
    count.order_total += 1

    if (category == categories.PARCEL) {
      count.order_parcel += 1
    } else if (category == categories.ESTATE) {
      count.order_estate += 1
    } else if (nft.category == categories.WEARABLE) {
      count.order_wearable += 1
    }
  }

  return count
}
