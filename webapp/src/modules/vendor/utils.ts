import {
  getSearchCategory,
  getSearchWearableCategory,
  Section,
  SearchOptions
} from '../routing/search'
import { NFTCategory } from '../nft/types'
import { Vendors } from './types'

export function getFilters(vendor: Vendors, searchOptions: SearchOptions): any {
  switch (vendor) {
    case Vendors.DECENTRALAND:
      const { section } = searchOptions

      const isLand = section === Section.LAND
      const isWearableHead = section === Section.WEARABLES_HEAD
      const isWearableAccessory = section === Section.WEARABLES_ACCESORIES

      const category = getSearchCategory(section!)
      const wearableCategory =
        !isWearableAccessory && category === NFTCategory.WEARABLE
          ? getSearchWearableCategory(section!)
          : undefined

      const { wearableRarities, wearableGenders, contracts } = searchOptions

      return {
        isLand,
        isWearableHead,
        isWearableAccessory,
        wearableCategory,
        wearableRarities,
        wearableGenders,
        contracts
      }
    case Vendors.SUPER_RARE:
    default:
      return {}
  }
}
