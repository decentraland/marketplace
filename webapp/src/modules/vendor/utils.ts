import { getSearchCategory, getSearchWearableCategory } from '../routing/search'
import { SearchOptions } from '../routing/types'
import { NFTCategory } from './decentraland/nft/types'
import { Section } from './decentraland/routing/types'
import { Vendors, Partner } from './types'

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

export function isVendor(vendor: string) {
  return Object.values(Vendors).includes(vendor as Vendors)
}

export function isPartner(vendor: string) {
  return Object.values(Partner).includes(vendor as Partner)
}
