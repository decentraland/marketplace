import {
  CollectionSortBy,
  EmoteCategory,
  EmotePlayMode,
  ItemSortBy,
  Network,
  NFTCategory,
  WearableCategory
} from '@dcl/schemas'
import { View } from '../ui/types'
import { BrowseOptions, SortBy, SortDirection } from './types'
import { Section } from '../vendor/decentraland'
import { NFTSortBy } from '../nft/types'
import { isAccountView } from '../ui/utils'

const SEARCH_ARRAY_PARAM_SEPARATOR = '_'

export function getDefaultOptionsByView(view?: View): BrowseOptions {
  return {
    onlyOnSale: !view || !isAccountView(view),
    sortBy: view && isAccountView(view) ? SortBy.NEWEST : SortBy.RECENTLY_LISTED
  }
}

export function getSearchParams(options?: BrowseOptions) {
  let params: URLSearchParams | undefined
  if (options) {
    params = new URLSearchParams()

    if (options.assetType) {
      params.set('assetType', options.assetType)
    }

    if (options.section) {
      params.set('section', options.section)
    }

    if (options.isMap !== undefined) {
      params.set('isMap', options.isMap.toString())
      // isFullscreen is only set if isMap is true
      if (options.isFullscreen !== undefined) {
        params.set('isFullscreen', options.isFullscreen.toString())
      }
    }

    if (options.vendor) {
      params.set('vendor', options.vendor)
    }
    if (options.page) {
      params.set('page', options.page.toString())
    }
    if (options.sortBy) {
      params.set('sortBy', options.sortBy)
    }
    if (options.onlyOnSale !== undefined) {
      params.set('onlyOnSale', options.onlyOnSale.toString())
    }
    if (options.onlyOnRent !== undefined) {
      params.set('onlyOnRent', options.onlyOnRent.toString())
    }
    if (options.rarities && options.rarities.length > 0) {
      params.set(
        'rarities',
        options.rarities.join(SEARCH_ARRAY_PARAM_SEPARATOR)
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

    if (options.network && Object.values(Network).includes(options.network)) {
      params.set('network', options.network)
    }

    if (
      options.emotePlayMode &&
      Object.values(EmotePlayMode).includes(options.emotePlayMode)
    ) {
      params.set('emotePlayMode', options.emotePlayMode)
    }

    if (options.viewAsGuest !== undefined) {
      params.set('viewAsGuest', options.viewAsGuest.toString())
    }

    if (options.onlySmart !== undefined) {
      params.set('onlySmart', options.onlySmart.toString())
    }
  }
  return params
}

export function getCategoryFromSection(section: string) {
  switch (section) {
    case Section.PARCELS:
      return NFTCategory.PARCEL
    case Section.ESTATES:
      return NFTCategory.ESTATE
    case Section.ENS:
      return NFTCategory.ENS
    case Section.EMOTES:
    case Section.EMOTES_DANCE:
    case Section.EMOTES_FUN:
    case Section.EMOTES_GREETINGS:
    case Section.EMOTES_HORROR:
    case Section.EMOTES_MISCELLANEOUS:
    case Section.EMOTES_POSES:
    case Section.EMOTES_REACTIONS:
    case Section.EMOTES_STUNT:
      return NFTCategory.EMOTE
    case Section.WEARABLES:
    case Section.WEARABLES_HEAD:
    case Section.WEARABLES_EYEBROWS:
    case Section.WEARABLES_EYES:
    case Section.WEARABLES_FACIAL_HAIR:
    case Section.WEARABLES_HAIR:
    case Section.WEARABLES_MOUTH:
    case Section.WEARABLES_UPPER_BODY:
    case Section.WEARABLES_LOWER_BODY:
    case Section.WEARABLES_FEET:
    case Section.WEARABLES_ACCESSORIES:
    case Section.WEARABLES_EARRING:
    case Section.WEARABLES_EYEWEAR:
    case Section.WEARABLES_HAT:
    case Section.WEARABLES_HELMET:
    case Section.WEARABLES_MASK:
    case Section.WEARABLES_TIARA:
    case Section.WEARABLES_TOP_HEAD:
    case Section.WEARABLES_SKIN:
      return NFTCategory.WEARABLE
  }
}

export function getSectionFromCategory(category: NFTCategory) {
  switch (category) {
    case NFTCategory.PARCEL:
      return Section.PARCELS
    case NFTCategory.ESTATE:
      return Section.ESTATES
    case NFTCategory.ENS:
      return Section.ENS
    case NFTCategory.EMOTE:
      return Section.EMOTES
    case NFTCategory.WEARABLE:
      return Section.WEARABLES
  }
}

export function getSearchSection(category: WearableCategory | EmoteCategory) {
  for (const section of Object.values(Section)) {
    const sectionCategory = Object.values(EmoteCategory).includes(
      category as EmoteCategory
    )
      ? getSearchEmoteCategory(section)
      : getSearchWearableCategory(section)
    if (category === sectionCategory) {
      return section
    }
  }
}

export function getSearchWearableCategory(section: string) {
  switch (section) {
    case Section.WEARABLES_EYEBROWS:
      return WearableCategory.EYEBROWS
    case Section.WEARABLES_EYES:
      return WearableCategory.EYES
    case Section.WEARABLES_FACIAL_HAIR:
      return WearableCategory.FACIAL_HAIR
    case Section.WEARABLES_HAIR:
      return WearableCategory.HAIR
    case Section.WEARABLES_MOUTH:
      return WearableCategory.MOUTH
    case Section.WEARABLES_UPPER_BODY:
      return WearableCategory.UPPER_BODY
    case Section.WEARABLES_LOWER_BODY:
      return WearableCategory.LOWER_BODY
    case Section.WEARABLES_FEET:
      return WearableCategory.FEET
    case Section.WEARABLES_EARRING:
      return WearableCategory.EARRING
    case Section.WEARABLES_EYEWEAR:
      return WearableCategory.EYEWEAR
    case Section.WEARABLES_HAT:
      return WearableCategory.HAT
    case Section.WEARABLES_HELMET:
      return WearableCategory.HELMET
    case Section.WEARABLES_MASK:
      return WearableCategory.MASK
    case Section.WEARABLES_TIARA:
      return WearableCategory.TIARA
    case Section.WEARABLES_TOP_HEAD:
      return WearableCategory.TOP_HEAD
    case Section.WEARABLES_SKIN:
      return WearableCategory.SKIN
  }
}

export function getSearchEmoteCategory(section: string) {
  switch (section) {
    case Section.EMOTES_DANCE:
      return EmoteCategory.DANCE
    case Section.EMOTES_FUN:
      return EmoteCategory.FUN
    case Section.EMOTES_GREETINGS:
      return EmoteCategory.GREETINGS
    case Section.EMOTES_HORROR:
      return EmoteCategory.HORROR
    case Section.EMOTES_MISCELLANEOUS:
      return EmoteCategory.MISCELLANEOUS
    case Section.EMOTES_POSES:
      return EmoteCategory.POSES
    case Section.EMOTES_REACTIONS:
      return EmoteCategory.REACTIONS
    case Section.EMOTES_STUNT:
      return EmoteCategory.STUNT
  }
}

export function getItemSortBy(sortBy: SortBy): ItemSortBy {
  switch (sortBy) {
    case SortBy.CHEAPEST:
      return ItemSortBy.CHEAPEST
    case SortBy.NAME:
      return ItemSortBy.NAME
    case SortBy.NEWEST:
      return ItemSortBy.NEWEST
    case SortBy.RECENTLY_LISTED:
      return ItemSortBy.RECENTLY_REVIEWED
    case SortBy.RECENTLY_SOLD:
      return ItemSortBy.RECENTLY_SOLD
    default:
      return ItemSortBy.RECENTLY_REVIEWED
  }
}

export function getCollectionSortBy(sortBy: SortBy): CollectionSortBy {
  switch (sortBy) {
    case SortBy.NAME:
      return CollectionSortBy.NAME
    case SortBy.NEWEST:
      return CollectionSortBy.NEWEST
    case SortBy.RECENTLY_REVIEWED:
      return CollectionSortBy.RECENTLY_REVIEWED
    case SortBy.SIZE:
      return CollectionSortBy.SIZE
    default:
      return CollectionSortBy.NEWEST
  }
}

export function getAssetOrderBy(sortBy: SortBy) {
  let orderBy: NFTSortBy = NFTSortBy.CREATED_AT
  let orderDirection: SortDirection = SortDirection.DESC

  switch (sortBy) {
    case SortBy.NAME: {
      orderBy = NFTSortBy.NAME
      orderDirection = SortDirection.ASC
      break
    }
    case SortBy.NEWEST: {
      orderBy = NFTSortBy.CREATED_AT
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.RECENTLY_LISTED: {
      orderBy = NFTSortBy.ORDER_CREATED_AT
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.CHEAPEST: {
      orderBy = NFTSortBy.PRICE
      orderDirection = SortDirection.ASC
      break
    }
    case SortBy.MAX_RENTAL_PRICE: {
      orderBy = NFTSortBy.MAX_RENTAL_PRICE
      orderDirection = SortDirection.ASC
      break
    }
    case SortBy.MIN_RENTAL_PRICE: {
      orderBy = NFTSortBy.MIN_RENTAL_PRICE
      orderDirection = SortDirection.ASC
      break
    }
    case SortBy.RENTAL_DATE: {
      orderBy = NFTSortBy.RENTAL_DATE
      orderDirection = SortDirection.DESC
      break
    }
    case SortBy.RENTAL_LISTING_DATE: {
      orderBy = NFTSortBy.RENTAL_LISTING_DATE
      orderDirection = SortDirection.DESC
      break
    }
  }

  return [orderBy, orderDirection] as const
}

export function getNFTSortBy(orderBy: NFTSortBy) {
  let sortBy: SortBy = SortBy.NEWEST

  switch (orderBy) {
    case NFTSortBy.NAME: {
      sortBy = SortBy.NAME
      break
    }
    case NFTSortBy.CREATED_AT: {
      sortBy = SortBy.NEWEST
      break
    }
    case NFTSortBy.ORDER_CREATED_AT: {
      sortBy = SortBy.RECENTLY_LISTED
      break
    }
    case NFTSortBy.PRICE: {
      sortBy = SortBy.CHEAPEST
      break
    }
    case NFTSortBy.MAX_RENTAL_PRICE: {
      sortBy = SortBy.MAX_RENTAL_PRICE
    }
  }

  return sortBy
}

export function getURLParamArray<T extends string>(
  search: string,
  paramName: string,
  validValues: string[] = []
) {
  const param = getURLParam<T>(search, paramName)
  return param === null
    ? []
    : (param
        .split(SEARCH_ARRAY_PARAM_SEPARATOR)
        .filter(item => validValues.includes(item as T)) as T[])
}

export function getURLParam<T extends string>(
  search: string,
  paramName: string
) {
  const param = new URLSearchParams(search).get(paramName) as T | null
  return param
}
