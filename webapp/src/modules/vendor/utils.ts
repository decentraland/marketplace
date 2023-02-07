import { NFTCategory, RentalStatus } from '@dcl/schemas'
import {
  getCategoryFromSection,
  getSearchEmoteCategory,
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
  const { section, address } = options

  switch (vendor) {
    case VendorName.DECENTRALAND: {
      const currentSection = Sections[VendorName.DECENTRALAND]

      const isLand = section === currentSection.LAND
      const isParcelsOrEstates =
        section === currentSection.PARCELS || section === currentSection.ESTATES
      const isWearableHead = section === currentSection.WEARABLES_HEAD
      const isWearableAccessory =
        section === currentSection.WEARABLES_ACCESSORIES

      const category = getCategoryFromSection(section!)
      const wearableCategory =
        !isWearableAccessory && category === NFTCategory.WEARABLE
          ? getSearchWearableCategory(section!)
          : undefined

      const emoteCategory =
        category === NFTCategory.EMOTE
          ? getSearchEmoteCategory(section!)
          : undefined

      const {
        rarities,
        wearableGenders,
        contracts,
        network,
        onlySmart,
        emotePlayMode,
        minPrice,
        maxPrice,
        minEstateSize,
        maxEstateSize
      } = options

      return {
        isLand,
        isWearableHead,
        isWearableAccessory,
        isWearableSmart: onlySmart,
        wearableCategory,
        emoteCategory,
        rarities,
        wearableGenders,
        contracts,
        network,
        emotePlayMode,
        rentalStatus:
          (isLand || isParcelsOrEstates) && address
            ? [RentalStatus.OPEN, RentalStatus.EXECUTED]
            : undefined,
        minPrice,
        maxPrice,
        minEstateSize,
        maxEstateSize
      } as NFTsFetchFilters<VendorName.DECENTRALAND>
    }
    default:
      return {}
  }
}

export function getOriginURL(vendor: VendorName) {
  switch (vendor) {
    case VendorName.DECENTRALAND:
      return 'https://market.decentraland.org'
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
