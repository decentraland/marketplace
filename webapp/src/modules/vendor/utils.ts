import { NFTCategory } from '@dcl/schemas'
import {
  getCategoryFromSection,
  getSearchWearableCategory
} from '../routing/search'
import { BrowseOptions } from '../routing/types'
import { Sections } from './routing/types'
import { NFTsFetchFilters } from './nft/types'
import { VendorName, Disabled } from './types'

export function getFilters(
  vendor: VendorName,
  options: BrowseOptions
): NFTsFetchFilters {
  const { section } = options

  switch (vendor) {
    case VendorName.DECENTRALAND: {
      const currentSection = Sections[VendorName.DECENTRALAND]

      const isLand = section === currentSection.LAND
      const isWearableHead = section === currentSection.WEARABLES_HEAD
      const isWearableAccessory =
        section === currentSection.WEARABLES_ACCESSORIES

      const category = getCategoryFromSection(section!)
      const wearableCategory =
        !isWearableAccessory && category === NFTCategory.WEARABLE
          ? getSearchWearableCategory(section!)
          : undefined

      const {
        wearableRarities,
        wearableGenders,
        contracts,
        network,
        onlySmart
      } = options

      return {
        isLand,
        isWearableHead,
        isWearableAccessory,
        isWearableSmart: onlySmart,
        wearableCategory,
        wearableRarities,
        wearableGenders,
        contracts,
        network
      } as NFTsFetchFilters<VendorName.DECENTRALAND>
    }
    case VendorName.KNOWN_ORIGIN: {
      const currentSection = Sections[VendorName.KNOWN_ORIGIN]

      return {
        isEdition: section === currentSection.EDITIONS,
        isToken: section === currentSection.TOKENS
      } as NFTsFetchFilters<VendorName.KNOWN_ORIGIN>
    }
    case VendorName.SUPER_RARE:
    case VendorName.MAKERS_PLACE:
    default:
      return {}
  }
}

export function getOriginURL(vendor: VendorName) {
  switch (vendor) {
    case VendorName.DECENTRALAND:
      return 'https://market.decentraland.org'
    case VendorName.SUPER_RARE:
      return 'https://www.superrare.co'
    case VendorName.MAKERS_PLACE:
      return 'https://makersplace.com'
    case VendorName.KNOWN_ORIGIN:
      return 'https://knownorigin.io'
    default:
      throw new Error(`Base URL for ${vendor} not implemented`)
  }
}

export function isVendor(vendor: string) {
  return Object.values(VendorName).includes(vendor as VendorName)
}

export function isPartner(vendor: string) {
  return isVendor(vendor) && vendor !== VendorName.DECENTRALAND
}

export function getPartners(): VendorName[] {
  const disabledVendors = Object.values(Disabled)

  return Object.values(VendorName).filter(
    vendor => isPartner(vendor) && !disabledVendors.includes(vendor)
  )
}
