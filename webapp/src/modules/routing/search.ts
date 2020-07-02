import { NFTCategory } from '../nft/types'
import { WearableCategory } from '../nft/wearable/types'
import { Vendors, Section } from '../vendor/types'
import { SearchOptions } from './types'

const SEARCH_ARRAY_PARAM_SEPARATOR = '_'

export function getSearchParams(options?: SearchOptions) {
  let params: URLSearchParams | undefined
  if (options) {
    params = new URLSearchParams()

    if (options.vendor) {
      params.set('vendor', options.vendor)
    }
    if (options.page) {
      params.set('page', options.page.toString())
    }
    if (options.section) {
      params.set('section', options.section)
    }
    if (options.sortBy) {
      params.set('sortBy', options.sortBy)
    }
    if (options.onlyOnSale !== undefined) {
      params.set('onlyOnSale', options.onlyOnSale.toString())
    }
    if (options.wearableRarities && options.wearableRarities.length > 0) {
      params.set(
        'rarities',
        options.wearableRarities.join(SEARCH_ARRAY_PARAM_SEPARATOR)
      )
    }
    if (options.wearableGenders && options.wearableGenders.length > 0) {
      params.set(
        'genders',
        options.wearableGenders.join(SEARCH_ARRAY_PARAM_SEPARATOR)
      )
    }

    if (options.contracts && options.contracts.length > 0) {
      params.set(
        'contracts',
        options.contracts.join(SEARCH_ARRAY_PARAM_SEPARATOR)
      )
    }

    if (options.search) {
      params.set('search', options.search)
    }
  }
  return params
}

export function getSearchCategory(section: Section) {
  const DecentralandSection = Section[Vendors.DECENTRALAND]
  switch (section) {
    case DecentralandSection.PARCELS:
      return NFTCategory.PARCEL
    case DecentralandSection.ESTATES:
      return NFTCategory.ESTATE
    case DecentralandSection.WEARABLES:
    case DecentralandSection.WEARABLES_HEAD:
    case DecentralandSection.WEARABLES_EYEBROWS:
    case DecentralandSection.WEARABLES_EYES:
    case DecentralandSection.WEARABLES_FACIAL_HAIR:
    case DecentralandSection.WEARABLES_HAIR:
    case DecentralandSection.WEARABLES_MOUTH:
    case DecentralandSection.WEARABLES_UPPER_BODY:
    case DecentralandSection.WEARABLES_LOWER_BODY:
    case DecentralandSection.WEARABLES_FEET:
    case DecentralandSection.WEARABLES_ACCESORIES:
    case DecentralandSection.WEARABLES_EARRING:
    case DecentralandSection.WEARABLES_EYEWEAR:
    case DecentralandSection.WEARABLES_HAT:
    case DecentralandSection.WEARABLES_HELMET:
    case DecentralandSection.WEARABLES_MASK:
    case DecentralandSection.WEARABLES_TIARA:
    case DecentralandSection.WEARABLES_TOP_HEAD:
      return NFTCategory.WEARABLE
    case DecentralandSection.ENS:
      return NFTCategory.ENS
  }
}

export function getSearchWearableSection(category: WearableCategory) {
  const DecentralandSection = Section[Vendors.DECENTRALAND]
  for (const section of Object.values(DecentralandSection)) {
    const sectionCategory = getSearchWearableCategory(section)
    if (category === sectionCategory) {
      return section
    }
  }
}

export function getSearchWearableCategory(section: Section) {
  const DecentralandSection = Section[Vendors.DECENTRALAND]
  switch (section) {
    case DecentralandSection.WEARABLES_EYEBROWS:
      return WearableCategory.EYEBROWS
    case DecentralandSection.WEARABLES_EYES:
      return WearableCategory.EYES
    case DecentralandSection.WEARABLES_FACIAL_HAIR:
      return WearableCategory.FACIAL_HAIR
    case DecentralandSection.WEARABLES_HAIR:
      return WearableCategory.HAIR
    case DecentralandSection.WEARABLES_MOUTH:
      return WearableCategory.MOUTH
    case DecentralandSection.WEARABLES_UPPER_BODY:
      return WearableCategory.UPPER_BODY
    case DecentralandSection.WEARABLES_LOWER_BODY:
      return WearableCategory.LOWER_BODY
    case DecentralandSection.WEARABLES_FEET:
      return WearableCategory.FEET
    case DecentralandSection.WEARABLES_EARRING:
      return WearableCategory.EARRING
    case DecentralandSection.WEARABLES_EYEWEAR:
      return WearableCategory.EYEWEAR
    case DecentralandSection.WEARABLES_HAT:
      return WearableCategory.HAT
    case DecentralandSection.WEARABLES_HELMET:
      return WearableCategory.HELMET
    case DecentralandSection.WEARABLES_MASK:
      return WearableCategory.MASK
    case DecentralandSection.WEARABLES_TIARA:
      return WearableCategory.TIARA
    case DecentralandSection.WEARABLES_TOP_HEAD:
      return WearableCategory.TOP_HEAD
  }
}

export function getParamArray<T extends string>(
  search: string,
  paramName: string,
  validValues: string[] = []
) {
  const param = new URLSearchParams(search).get(paramName)
  return param === null
    ? []
    : (param
        .split(SEARCH_ARRAY_PARAM_SEPARATOR)
        .filter(item => validValues.includes(item as T)) as T[])
}
