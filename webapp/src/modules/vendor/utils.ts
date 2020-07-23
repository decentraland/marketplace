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
    case Vendors.MAKERS_PLACE:
    default:
      return {}
  }
}

export function getOriginURL(vendor: Vendors) {
  switch (vendor) {
    case Vendors.DECENTRALAND:
      return 'https://market.decentraland.org'
    case Vendors.SUPER_RARE:
      return 'https://www.superrare.co'
    case Vendors.MAKERS_PLACE:
      return 'https://makersplace.com'
    default:
      throw new Error(`Base URL for ${vendor} not implemented`)
  }
}

export function isVendor(vendor: string) {
  return Object.values(Vendors).includes(vendor as Vendors)
}

export function isPartner(vendor: string) {
  return Object.values(Partner).includes(vendor as Partner)
}
