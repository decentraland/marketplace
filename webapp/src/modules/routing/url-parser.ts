import { EmoteOutcomeType, EmotePlayMode, GenderFilterOption, Network, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { isOfEnumType } from '../../utils/enums'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { View } from '../ui/types'
import { isLandSection, isListsSection } from '../ui/utils'
import { Section, Sections } from '../vendor/routing/types'
import { VendorName } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { locations } from './locations'
import { getDefaultOptionsByView, getURLParam, getURLParamArray, getURLParamArrayNonStandard, SEARCH_ARRAY_PARAM_SEPARATOR } from './search'
import { BrowseOptions, SortBy, SortByOption } from './types'
import { getAllSortByOptions } from './utils'

export const getVendorFromSearchParameters = (search: string): VendorName => {
  const vendor = getURLParam<VendorName>(search, 'vendor')
  if (vendor && isVendor(vendor)) {
    return vendor
  }
  return VendorName.DECENTRALAND
}

export const getSectionFromUrl = (search: string, pathname: string): Section => {
  const vendor = getVendorFromSearchParameters(search)
  const section = getURLParam<string>(search, 'section') ?? ''
  if (!section && pathname === locations.lands()) {
    return Sections.decentraland.LAND
  }

  if (!section && pathname === locations.names()) {
    return Sections.decentraland.ENS
  }

  if (
    (!section || (isOfEnumType(section, Sections[vendor]) && section === Sections[vendor].ALL)) &&
    pathname === locations.browse() &&
    vendor === VendorName.DECENTRALAND
  ) {
    return Sections.decentraland.WEARABLES
  }

  if (!section || !(section.toUpperCase() in Sections[vendor])) {
    return Sections[vendor].ALL
  }

  return section as Section
}

export const getPageNumberFromSearchParameters = (search: string): number => {
  const page = getURLParam(search, 'page')
  return page === null || isNaN(+page) ? 1 : +page
}

export const getSortByFromSearchParameters = (search: string, pathname: string, view?: View): SortBy | undefined => {
  const section = getSectionFromUrl(search, pathname)
  return getURLParam<SortBy>(search, 'sortBy') || getDefaultOptionsByView(view, section).sortBy
}

export const getOnlyOnSaleFromSearchParameters = (search: string, pathname: string, view?: View): boolean | undefined => {
  const section = getSectionFromUrl(search, pathname)
  const onlyOnSale = getURLParam(search, 'onlyOnSale')
  switch (onlyOnSale) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return isLandSection(section) ? undefined : getDefaultOptionsByView(view, section).onlyOnSale
  }
}

export const getOnlyOnRentFromSearchParameters = (search: string): boolean | undefined => {
  const onlyOnRent = getURLParam(search, 'onlyOnRent')
  switch (onlyOnRent) {
    case 'true':
      return true
    case 'false':
      return false
  }

  return undefined
}

export const getStatusFromSearchParameters = (search: string): AssetStatusFilter | undefined => {
  return getURLParamArray<AssetStatusFilter>(search, 'status', Object.values(AssetStatusFilter))[0]
}

export const getEmotePlayModeFromSearchParameters = (search: string): EmotePlayMode[] | undefined =>
  getURLParamArray<EmotePlayMode>(search, 'emotePlayMode') || undefined

export const getViewAsGuestFromSearchParameters = (search: string): boolean | undefined =>
  getURLParam(search, 'viewAsGuest') ? getURLParam(search, 'viewAsGuest') === 'true' : undefined

export const getOnlySmartFromSearchParameters = (search: string): boolean | undefined =>
  getURLParam(search, 'onlySmart') ? getURLParam(search, 'onlySmart') === 'true' : undefined

export const getMinPriceFromSearchParameters = (search: string): string => (getURLParam(search, 'minPrice') as string) || ''

export const getMaxPriceFromSearchParameters = (search: string): string => (getURLParam(search, 'maxPrice') as string) || ''

export const getMinEstateSizeFromSearchParameters = (search: string): string => (getURLParam(search, 'minEstateSize') as string) || ''

export const getMaxEstateSizeFromSearchParameters = (search: string): string => (getURLParam(search, 'maxEstateSize') as string) || ''

export const getMinDistanceToPlazaFromSearchParameters = (search: string): string =>
  (getURLParam(search, 'minDistanceToPlaza') as string) || ''

export const getMaxDistanceToPlazaFromSearchParameters = (search: string): string =>
  (getURLParam(search, 'maxDistanceToPlaza') as string) || ''

export const getAdjacentToRoadFromSearchParameters = (search: string): boolean => getURLParam(search, 'adjacentToRoad') === 'true'

export const getEmoteHasSoundFromSearchParameters = (search: string): boolean => getURLParam(search, 'emoteHasSound') === 'true'

export const getEmoteHasGeometryFromSearchParameters = (search: string): boolean => getURLParam(search, 'emoteHasGeometry') === 'true'

export const getEmoteOutcomeFromSearchParameters = (search: string): EmoteOutcomeType | undefined =>
  getURLParam(search, 'emoteOutcomeType') as EmoteOutcomeType | undefined

export const getWithCreditsFromSearchParameters = (search: string): boolean | undefined =>
  getURLParam(search, 'withCredits') ? getURLParam(search, 'withCredits') === 'true' : undefined

export const getRentalDaysFromSearchParameters = (search: string): number[] =>
  getURLParamArray(search, 'rentalDays').map(value => Number.parseInt(value))

export const getIsSoldOutFromSearchParameters = (search: string): boolean => getURLParam(search, 'isSoldOut') === 'true'

export const getIsMapFromSearchParameters = (search: string): boolean | undefined =>
  getURLParam(search, 'isMap') ? getURLParam(search, 'isMap') === 'true' : undefined

export const getItemIdFromSearchParameters = (search: string): string | undefined => getURLParam(search, 'itemId') || undefined

export const getRaritiesFromSearchParameters = (search: string): Rarity[] =>
  getURLParamArrayNonStandard<Rarity>(search, 'rarities', Object.values(Rarity).filter(value => typeof value === 'string') as string[])

export const getWearableGendersFromSearchParameters = (search: string): GenderFilterOption[] =>
  getURLParamArrayNonStandard<GenderFilterOption>(search, 'genders', Object.values(GenderFilterOption))

export const getContractsFromSearchParameters = (search: string): string[] =>
  getURLParam<string>(search, 'contracts')?.split(SEARCH_ARRAY_PARAM_SEPARATOR) || []

export const getCreatorsFromSearchParameters = (search: string): string[] => getURLParamArray<string>(search, 'creators')

export const getSearchFromSearchParameters = (search: string): string => getURLParam(search, 'search') || ''

export const getNetworkFromSearchParameters = (search: string): Network | undefined =>
  (getURLParam(search, 'network') as Network) || undefined

export const getWithCardFromSearchParameters = (search: string): boolean => {
  const withCard = getURLParam(search, 'withCard')
  return withCard !== null && withCard === 'true'
}

export const getIsFullscreenFromSearchParameters = (search: string, isMap: boolean | undefined): boolean | undefined => {
  const isFullscreen = getURLParam(search, 'isFullscreen')
  return isFullscreen === null ? undefined : isMap && isFullscreen === 'true'
}

export const getAssetTypeFromUrl = (search: string, pathname: string): AssetType => {
  const vendor = getVendorFromSearchParameters(search)
  const assetTypeParam = getURLParam(search, 'assetType') ?? ''

  if (!assetTypeParam || !(assetTypeParam.toUpperCase() in AssetType)) {
    if (vendor === VendorName.DECENTRALAND && pathname === locations.browse()) {
      return AssetType.ITEM
    }

    return AssetType.NFT
  }
  return assetTypeParam as AssetType
}

export const getEmoteUrlParamsFromSearchParameters = (search: string) => ({
  emotePlayMode: getEmotePlayModeFromSearchParameters(search),
  emoteHasGeometry: getEmoteHasGeometryFromSearchParameters(search),
  emoteHasSound: getEmoteHasSoundFromSearchParameters(search),
  emoteOutcomeType: getEmoteOutcomeFromSearchParameters(search)
})

export const getPaginationParamsFromUrl = (search: string, pathname: string, view?: View) => ({
  page: getPageNumberFromSearchParameters(search),
  sortBy: getSortByFromSearchParameters(search, pathname, view),
  search: getSearchFromSearchParameters(search)
})

export const getAssetUrlParamsFromUrl = (search: string, pathname: string, view?: View) => ({
  onlyOnSale: getOnlyOnSaleFromSearchParameters(search, pathname, view),
  onlySmart: getOnlySmartFromSearchParameters(search),
  isSoldOut: getIsSoldOutFromSearchParameters(search),
  itemId: getItemIdFromSearchParameters(search),
  contracts: getContractsFromSearchParameters(search),
  creators: getCreatorsFromSearchParameters(search),
  search: getSearchFromSearchParameters(search),
  withCredits: getWithCreditsFromSearchParameters(search)
})

export const getLandsUrlParamsFromSearchParameters = (search: string) => ({
  isMap: getIsMapFromSearchParameters(search),
  isFullscreen: getIsFullscreenFromSearchParameters(search, getIsMapFromSearchParameters(search)),
  minEstateSize: getMinEstateSizeFromSearchParameters(search),
  maxEstateSize: getMaxEstateSizeFromSearchParameters(search),
  minDistanceToPlaza: getMinDistanceToPlazaFromSearchParameters(search),
  maxDistanceToPlaza: getMaxDistanceToPlazaFromSearchParameters(search),
  adjacentToRoad: getAdjacentToRoadFromSearchParameters(search),
  rentalDays: getRentalDaysFromSearchParameters(search)
})

const getWearablesUrlParamsFromUrl = (search: string) => ({
  rarities: getRaritiesFromSearchParameters(search),
  wearableGenders: getWearableGendersFromSearchParameters(search),
  viewAsGuest: getViewAsGuestFromSearchParameters(search),
  minPrice: getMinPriceFromSearchParameters(search),
  maxPrice: getMaxPriceFromSearchParameters(search),
  status: getStatusFromSearchParameters(search)
})

export const getCurrentBrowseOptions = (search: string, pathname: string, view?: View) => ({
  assetType: getAssetTypeFromUrl(search, pathname),
  vendor: getVendorFromSearchParameters(search),
  section: getSectionFromUrl(search, pathname),
  network: getNetworkFromSearchParameters(search),
  ...getEmoteUrlParamsFromSearchParameters(search),
  ...getAssetUrlParamsFromUrl(search, pathname, view),
  ...getPaginationParamsFromUrl(search, pathname, view),
  ...getLandsUrlParamsFromSearchParameters(search),
  ...getWearablesUrlParamsFromUrl(search),
  onlyOnRent: getOnlyOnRentFromSearchParameters(search),
  onlyOnSale: getOnlyOnSaleFromSearchParameters(search, pathname, view),
  view: view,
  // Address is now computed externally, I've left here for backwards compatibility
  address: undefined as string | undefined
})

export const hasFiltersEnabled = (browseOptions: BrowseOptions) => {
  const {
    network,
    wearableGenders,
    rarities,
    contracts,
    emotePlayMode,
    onlyOnRent,
    onlyOnSale,
    minPrice,
    maxPrice,
    minEstateSize,
    maxEstateSize,
    section,
    minDistanceToPlaza,
    maxDistanceToPlaza,
    adjacentToRoad,
    creators,
    rentalDays,
    status,
    onlySmart,
    emoteHasGeometry,
    emoteHasSound,
    emoteOutcomeType
  } = browseOptions

  const isLand = isLandSection(section as Section)

  if (isListsSection(section as Section)) return false

  if (isLand) {
    const hasOnSaleFilter = onlyOnSale === true
    const hasOnRentFilter = onlyOnRent === true
    return (
      (hasOnSaleFilter && !hasOnRentFilter) ||
      (hasOnRentFilter && !hasOnSaleFilter) ||
      !!minPrice ||
      !!maxPrice ||
      !!minEstateSize ||
      !!maxEstateSize ||
      !!minDistanceToPlaza ||
      !!maxDistanceToPlaza ||
      !!adjacentToRoad ||
      !!rentalDays?.length
    )
  }

  const hasNetworkFilter = network !== undefined
  const hasGenderFilter = wearableGenders && wearableGenders.length > 0
  const hasRarityFilter = rarities && rarities.length > 0
  const hasContractsFilter = contracts && contracts.length > 0
  const hasCreatorFilter = creators && creators.length > 0
  const hasEmotePlayModeFilter = emotePlayMode && emotePlayMode.length > 0
  const hasNotOnSaleFilter = onlyOnSale === false

  return (
    hasNetworkFilter ||
    hasGenderFilter ||
    onlySmart ||
    hasRarityFilter ||
    hasContractsFilter ||
    hasCreatorFilter ||
    hasEmotePlayModeFilter ||
    !!minPrice ||
    !!maxPrice ||
    hasNotOnSaleFilter ||
    emoteHasSound ||
    emoteHasGeometry ||
    emoteOutcomeType ||
    (!!status && status !== AssetStatusFilter.ON_SALE)
  )
}

export const getSortByOptionsFromUrl = (search: string, pathname: string, view?: View): SortByOption[] => {
  const onlyOnRent = getOnlyOnRentFromSearchParameters(search)
  const onlyOnSale = getOnlyOnSaleFromSearchParameters(search, pathname, view)
  const status = getStatusFromSearchParameters(search)

  const SORT_BY_MAP = getAllSortByOptions()
  let orderByDropdownOptions: SortByOption[] = []
  if (status && isOfEnumType(status, AssetStatusFilter)) {
    const baseFilters = [
      SORT_BY_MAP[SortBy.NEWEST],
      SORT_BY_MAP[SortBy.RECENTLY_LISTED],
      SORT_BY_MAP[SortBy.RECENTLY_SOLD],
      SORT_BY_MAP[SortBy.CHEAPEST],
      SORT_BY_MAP[SortBy.MOST_EXPENSIVE]
    ]
    switch (status) {
      case AssetStatusFilter.ON_SALE:
      case AssetStatusFilter.ONLY_MINTING:
      case AssetStatusFilter.ONLY_LISTING:
        orderByDropdownOptions = baseFilters
        break
      case AssetStatusFilter.NOT_FOR_SALE:
        orderByDropdownOptions = [SORT_BY_MAP[SortBy.NEWEST]]
        break
    }
    return orderByDropdownOptions
  }
  if (onlyOnRent) {
    orderByDropdownOptions = [
      {
        value: SortBy.RENTAL_LISTING_DATE,
        text: t('filters.recently_listed_for_rent')
      },
      { value: SortBy.NAME, text: t('filters.name') },
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.MAX_RENTAL_PRICE, text: t('filters.cheapest') }
    ]
  } else {
    orderByDropdownOptions = [
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.NAME, text: t('filters.name') }
    ]
  }

  if (onlyOnSale) {
    orderByDropdownOptions = [
      {
        value: SortBy.RECENTLY_LISTED,
        text: t('filters.recently_listed')
      },
      {
        value: SortBy.RECENTLY_SOLD,
        text: t('filters.recently_sold')
      },
      {
        value: SortBy.CHEAPEST,
        text: t('filters.cheapest')
      },
      ...orderByDropdownOptions
    ]
  }

  return orderByDropdownOptions
}
