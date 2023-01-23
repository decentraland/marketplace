import { NFTCategory } from '@dcl/schemas'
import { ethers } from 'ethers'
import {
  PriceFilterExtraOption,
  PriceFilterOptions,
  Section
} from '../../../modules/vendor/decentraland'

const LAND_MAX_PRICE_ALLOWED = ethers.BigNumber.from(
  '1000000000000000000000000000'
) // 1B

const ENS_MAX_PRICE_ALLOWED = ethers.BigNumber.from(
  '100000000000000000000000000'
) // 100M

const WEARABLES_MAX_PRICE_ALLOWED = ethers.BigNumber.from(
  '1000000000000000000000'
) // 1k

export const getChartUpperBound = (section: string) => {
  let upperBound = WEARABLES_MAX_PRICE_ALLOWED
  switch (section) {
    case Section.LAND:
    case Section.ESTATES:
    case Section.PARCELS:
      upperBound = LAND_MAX_PRICE_ALLOWED
      break
    case Section.ENS:
      upperBound = ENS_MAX_PRICE_ALLOWED
      break

    default:
      upperBound = WEARABLES_MAX_PRICE_ALLOWED
      break
  }

  return upperBound
}

export const sectionToPriceFilterOptions = (
  section: Section
): PriceFilterOptions => {
  switch (section) {
    case Section.LAND:
      return PriceFilterExtraOption.LAND
    case Section.PARCELS:
      return NFTCategory.PARCEL
    case Section.ESTATES:
      return NFTCategory.ESTATE
    case Section.WEARABLES:
      return NFTCategory.WEARABLE
    case Section.EMOTES:
      return NFTCategory.EMOTE
    case Section.ENS:
      return NFTCategory.ENS

    default:
      throw Error('Invalid section to fetch price')
  }
}
