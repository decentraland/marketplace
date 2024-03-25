import { ethers } from 'ethers'
import { NFTCategory } from '@dcl/schemas'
import { getCategoryFromSection, getSearchEmoteCategory, getSearchWearableCategory } from '../../../modules/routing/search'
import { PriceFilterExtraOption, PriceFilters, Section } from '../../../modules/vendor/decentraland'
import { isOfEnumType } from '../../../utils/enums'

const LAND_MAX_PRICE_ALLOWED = ethers.BigNumber.from('1000000000000000000000000000') // 1B

const ENS_MAX_PRICE_ALLOWED = ethers.BigNumber.from('100000000000000000000000000') // 100M

const WEARABLES_MAX_PRICE_ALLOWED = ethers.BigNumber.from('1000000000000000000000') // 1k

export const getChartUpperBound = (section: string) => {
  let upperBound = WEARABLES_MAX_PRICE_ALLOWED
  if (isOfEnumType(section, Section)) {
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
  }
  return upperBound
}

export const getPriceFiltersForSection = (section: Section): PriceFilters => {
  const category = section === Section.LAND ? PriceFilterExtraOption.LAND : getCategoryFromSection(section)

  if (!category) {
    throw Error('Invalid section to fetch price')
  }

  const isWearableHead = section === Section.WEARABLES_HEAD
  const isWearableAccessory = section === Section.WEARABLES_ACCESSORIES
  const wearableCategory = !isWearableAccessory && category === NFTCategory.WEARABLE ? getSearchWearableCategory(section) : undefined

  const emoteCategory = category === NFTCategory.EMOTE ? getSearchEmoteCategory(section) : undefined

  return {
    isWearableHead,
    isWearableAccessory,
    wearableCategory,
    emoteCategory,
    category
  }
}
