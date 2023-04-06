import { createSelector } from 'reselect'
import {
  getSearch as getRouterSearch,
  getLocation
} from 'connected-react-router'
import {
  EmotePlayMode,
  GenderFilterOption,
  Network,
  Rarity
} from '@dcl/schemas'
import { getView } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { VendorName } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { Section, Sections } from '../vendor/routing/types'
import { RootState } from '../reducer'
import { AssetType } from '../asset/types'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { getAddress as getAccountAddress } from '../account/selectors'
import { isLandSection, isListsSection } from '../ui/utils'
import {
  getDefaultOptionsByView,
  getURLParamArray,
  getURLParam,
  getURLParamArray_nonStandard
} from './search'
import { BrowseOptions, SortBy } from './types'
import { locations } from './locations'

export const getState = (state: RootState) => state.routing

export const getVisitedLocations = (state: RootState) =>
  getState(state).visitedLocations

const getPathName = createSelector<
  RootState,
  ReturnType<typeof getLocation>,
  string
>(getLocation, location => location.pathname)

export const getVendor = createSelector<RootState, string, VendorName>(
  getRouterSearch,
  search => {
    const vendor = getURLParam<VendorName>(search, 'vendor')
    if (vendor && isVendor(vendor)) {
      return vendor
    }
    return VendorName.DECENTRALAND
  }
)

export const getSection = createSelector<
  RootState,
  string,
  ReturnType<typeof getPathName>,
  VendorName,
  Section
>(getRouterSearch, getPathName, getVendor, (search, pathname, vendor) => {
  const section = getURLParam<string>(search, 'section') ?? ''
  if (!section && pathname === locations.lands()) {
    return Sections.decentraland.LAND
  }

  if (
    (!section || section === Sections[vendor].ALL) &&
    pathname === locations.browse() &&
    vendor === VendorName.DECENTRALAND
  ) {
    return Sections.decentraland.WEARABLES
  }

  if (!section || !(section.toUpperCase() in Sections[vendor])) {
    return Sections[vendor].ALL
  }

  return section as Section
})

export const getPage = createSelector<RootState, string, number>(
  getRouterSearch,
  search => {
    const page = getURLParam(search, 'page')
    return page === null || isNaN(+page) ? 1 : +page
  }
)

export const getSortBy = createSelector<
  RootState,
  string,
  View | undefined,
  Section,
  SortBy | undefined
>(
  getRouterSearch,
  getView,
  getSection,
  (search, view, section) =>
    getURLParam<SortBy>(search, 'sortBy') ||
    getDefaultOptionsByView(view, section).sortBy
)

export const getOnlyOnSale = createSelector<
  RootState,
  string,
  View | undefined,
  Section | undefined,
  boolean | undefined
>(getRouterSearch, getView, getSection, (search, view, section) => {
  const onlyOnSale = getURLParam(search, 'onlyOnSale')
  switch (onlyOnSale) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return isLandSection(section)
        ? undefined
        : getDefaultOptionsByView(view, section).onlyOnSale!
  }
})

export const getOnlyOnRent = createSelector<
  RootState,
  string,
  boolean | undefined
>(getRouterSearch, search => {
  const onlyOnRent = getURLParam(search, 'onlyOnRent')
  switch (onlyOnRent) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return undefined
  }
})

export const getIsSoldOut = createSelector<
  RootState,
  string,
  boolean | undefined
>(getRouterSearch, search => {
  const isSoldOut = getURLParam(search, 'isSoldOut')
  return isSoldOut === 'true'
})

export const getIsMap = createSelector<RootState, string, boolean | undefined>(
  getRouterSearch,
  search => {
    const isMap = getURLParam(search, 'isMap')
    return isMap === null ? undefined : isMap === 'true'
  }
)

export const getItemId = createSelector<RootState, string, string | undefined>(
  getRouterSearch,
  search => {
    const itemId = getURLParam(search, 'itemId')
    return itemId ? itemId : undefined
  }
)

export const getIsFullscreen = createSelector<
  RootState,
  string,
  boolean | undefined,
  boolean | undefined
>(getRouterSearch, getIsMap, (search, isMap) => {
  const isFullscreen = getURLParam(search, 'isFullscreen')
  return isFullscreen === null ? undefined : isMap && isFullscreen === 'true'
})

export const getRarities = createSelector<RootState, string, Rarity[]>(
  getRouterSearch,
  search =>
    getURLParamArray_nonStandard<Rarity>(
      search,
      'rarities',
      Object.values(Rarity).filter(
        value => typeof value === 'string'
      ) as string[]
    )
)

export const getWearableGenders = createSelector<
  RootState,
  string,
  GenderFilterOption[]
>(getRouterSearch, search =>
  getURLParamArray_nonStandard<GenderFilterOption>(
    search,
    'genders',
    Object.values(GenderFilterOption)
  )
)

export const getContracts = createSelector<RootState, string, string[]>(
  getRouterSearch,
  search => getURLParamArray<string>(search, 'contracts')
)

export const getCreators = createSelector<RootState, string, string[]>(
  getRouterSearch,
  search => getURLParamArray<string>(search, 'creators')
)

export const getSearch = createSelector<RootState, string, string>(
  getRouterSearch,
  search => getURLParam(search, 'search') || ''
)

export const getNetwork = createSelector<
  RootState,
  string,
  Network | undefined
>(
  getRouterSearch,
  search => (getURLParam(search, 'network') as Network) || undefined
)

export const getAssetType = createSelector<
  RootState,
  string,
  string,
  VendorName,
  AssetType
>(getRouterSearch, getPathName, getVendor, (search, pathname, vendor) => {
  let assetTypeParam = getURLParam(search, 'assetType') ?? ''

  if (!assetTypeParam || !(assetTypeParam.toUpperCase() in AssetType)) {
    if (vendor === VendorName.DECENTRALAND && pathname === locations.browse()) {
      return AssetType.ITEM
    }
    return AssetType.NFT
  }
  return assetTypeParam as AssetType
})

export const getEmotePlayMode = createSelector<
  RootState,
  string,
  EmotePlayMode[] | undefined
>(
  getRouterSearch,
  search =>
    getURLParamArray<EmotePlayMode>(search, 'emotePlayMode') || undefined
)

export const getViewAsGuest = createSelector<
  RootState,
  string,
  boolean | undefined
>(getRouterSearch, search =>
  getURLParam(search, 'viewAsGuest')
    ? getURLParam(search, 'viewAsGuest') === 'true'
    : undefined
)
export const getOnlySmart = createSelector<
  RootState,
  string,
  boolean | undefined
>(getRouterSearch, search =>
  getURLParam(search, 'onlySmart')
    ? getURLParam(search, 'onlySmart') === 'true'
    : undefined
)

export const getMinPrice = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'minPrice') as string) || ''
)

export const getMaxPrice = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'maxPrice') as string) || ''
)

export const getMinEstateSize = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'minEstateSize') as string) || ''
)

export const getMaxEstateSize = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'maxEstateSize') as string) || ''
)

export const getRentalDays = createSelector<RootState, string, number[]>(
  getRouterSearch,
  search =>
    getURLParamArray(search, 'rentalDays').map(value =>
      Number.parseInt(value)
    ) as number[]
)

export const getMinDistanceToPlaza = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'minDistanceToPlaza') as string) || ''
)

export const getMaxDistanceToPlaza = createSelector<RootState, string, string>(
  getRouterSearch,
  search => (getURLParam(search, 'maxDistanceToPlaza') as string) || ''
)

export const getAdjacentToRoad = createSelector<RootState, string, boolean>(
  getRouterSearch,
  search => getURLParam(search, 'adjacentToRoad') === 'true'
)

export const getCurrentLocationAddress = createSelector<
  RootState,
  string,
  string | undefined,
  string | undefined,
  string | undefined
>(
  getPathName,
  getWalletAddress,
  getAccountAddress,
  (pathname, walletAddess, accountAddress) => {
    let address: string | undefined

    if (pathname === locations.currentAccount()) {
      address = walletAddess
    } else {
      address = accountAddress
    }

    return address ? address.toLowerCase() : undefined
  }
)

export const getPaginationUrlParams = createSelector(
  getPage,
  getSortBy,
  getSearch,
  (page, sortBy, search) => ({ page, sortBy, search })
)

export const getAssetsUrlParams = createSelector(
  getOnlyOnSale,
  getOnlySmart,
  getIsSoldOut,
  getItemId,
  getContracts,
  getCreators,
  (onlyOnSale, onlySmart, isSoldOut, itemId, contracts, creators) => ({
    onlyOnSale,
    onlySmart,
    isSoldOut,
    itemId,
    contracts,
    creators
  })
)

export const getLandsUrlParams = createSelector(
  getIsMap,
  getIsFullscreen,
  getMinEstateSize,
  getMaxEstateSize,
  getMinDistanceToPlaza,
  getMaxDistanceToPlaza,
  getAdjacentToRoad,
  getRentalDays,
  (
    isMap,
    isFullscreen,
    minEstateSize,
    maxEstateSize,
    minDistanceToPlaza,
    maxDistanceToPlaza,
    adjacentToRoad,
    rentalDays
  ) => ({
    isMap,
    isFullscreen,
    minEstateSize,
    maxEstateSize,
    minDistanceToPlaza,
    maxDistanceToPlaza,
    adjacentToRoad,
    rentalDays
  })
)

export const getWearablesUrlParams = createSelector(
  getRarities,
  getWearableGenders,
  getView,
  getViewAsGuest,
  getMinPrice,
  getMaxPrice,
  (rarities, wearableGenders, view, viewAsGuest, minPrice, maxPrice) => ({
    rarities,
    wearableGenders,
    view,
    viewAsGuest,
    minPrice,
    maxPrice
  })
)

export const getCurrentBrowseOptions = createSelector(
  [
    getAssetType,
    getCurrentLocationAddress,
    getVendor,
    getSection,
    getNetwork,
    getEmotePlayMode,
    getPaginationUrlParams,
    getAssetsUrlParams,
    getLandsUrlParams,
    getWearablesUrlParams,
    getOnlyOnRent,
    getOnlyOnSale
  ],
  (
    assetType,
    address,
    vendor,
    section,
    network,
    emotePlayMode,
    paginationUrlParams,
    AssetsUrlParams,
    landsUrlParams,
    wearablesUrlParams,
    onlyOnRent,
    onlyOnSale
  ) =>
    ({
      assetType,
      address,
      vendor,
      section,
      network,
      emotePlayMode,
      ...AssetsUrlParams,
      ...paginationUrlParams,
      ...landsUrlParams,
      ...wearablesUrlParams,
      onlyOnRent,
      onlyOnSale
    } as BrowseOptions)
)

export const hasFiltersEnabled = createSelector<
  RootState,
  BrowseOptions,
  boolean
>(getCurrentBrowseOptions, browseOptions => {
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
    rentalDays
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
    hasRarityFilter ||
    hasContractsFilter ||
    hasCreatorFilter ||
    hasEmotePlayModeFilter ||
    !!minPrice ||
    !!maxPrice ||
    hasNotOnSaleFilter
  )
})

export const getIsBuyWithCardPage = createSelector<RootState, string, boolean>(
  getRouterSearch,
  search => {
    const withCard = getURLParam(search, 'withCard')
    return withCard !== null && withCard === 'true'
  }
)
