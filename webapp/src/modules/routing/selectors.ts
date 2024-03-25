import { matchPath } from 'react-router'
import { getSearch as getRouterSearch, getLocation } from 'connected-react-router'
import { createSelector } from 'reselect'
import { EmotePlayMode, GenderFilterOption, Network, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isOfEnumType } from '../../utils/enums'
import { AssetStatusFilter } from '../../utils/filters'
import { getAddress as getAccountAddress } from '../account/selectors'
import { AssetType } from '../asset/types'
import { RootState } from '../reducer'
import { getView } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { isLandSection, isListsSection } from '../ui/utils'
import { Section, Sections } from '../vendor/routing/types'
import { VendorName } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { locations } from './locations'
import { getDefaultOptionsByView, getURLParamArray, getURLParam, getURLParamArrayNonStandard, SEARCH_ARRAY_PARAM_SEPARATOR } from './search'
import { BrowseOptions, PageName, SortBy, SortByOption } from './types'

export const getState = (state: RootState) => state.routing

export const getVisitedLocations = (state: RootState) => getState(state).visitedLocations

export const getLatestVisitedLocation = createSelector<RootState, ReturnType<typeof getLocation>[], ReturnType<typeof getLocation>>(
  getVisitedLocations,
  visitedLocations => visitedLocations[visitedLocations.length - 1]
)

const getPathName = createSelector<RootState, ReturnType<typeof getLocation>, string>(getLocation, location => location.pathname)

export const getVendor = createSelector<RootState, string, VendorName>(getRouterSearch, search => {
  const vendor = getURLParam<VendorName>(search, 'vendor')
  if (vendor && isVendor(vendor)) {
    return vendor
  }
  return VendorName.DECENTRALAND
})

export const getSection = createSelector<RootState, string, ReturnType<typeof getPathName>, VendorName, Section>(
  getRouterSearch,
  getPathName,
  getVendor,
  (search, pathname, vendor) => {
    const section = getURLParam<string>(search, 'section') ?? ''
    if (!section && pathname === locations.lands()) {
      return Sections.decentraland.LAND
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
)

export const getPageNumber = createSelector<RootState, string, number>(getRouterSearch, search => {
  const page = getURLParam(search, 'page')
  return page === null || isNaN(+page) ? 1 : +page
})

export const getSortBy = createSelector<RootState, string, View | undefined, Section, SortBy | undefined>(
  getRouterSearch,
  getView,
  getSection,
  (search, view, section) => {
    return getURLParam<SortBy>(search, 'sortBy') || getDefaultOptionsByView(view, section).sortBy
  }
)

export const getOnlyOnSale = createSelector<RootState, string, View | undefined, Section | undefined, boolean | undefined>(
  getRouterSearch,
  getView,
  getSection,
  (search, view, section) => {
    const onlyOnSale = getURLParam(search, 'onlyOnSale')
    switch (onlyOnSale) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return isLandSection(section) ? undefined : getDefaultOptionsByView(view, section).onlyOnSale!
    }
  }
)

export const getOnlyOnRent = createSelector<RootState, string, boolean | undefined>(getRouterSearch, search => {
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

export const getAllSortByOptions = () => ({
  [SortBy.NEWEST]: { value: SortBy.NEWEST, text: t('filters.newest') },
  [SortBy.NAME]: { value: SortBy.NAME, text: t('filters.name') },
  [SortBy.RECENTLY_SOLD]: {
    value: SortBy.RECENTLY_SOLD,
    text: t('filters.recently_sold')
  },
  [SortBy.CHEAPEST]: {
    value: SortBy.CHEAPEST,
    text: t('filters.cheapest')
  },
  [SortBy.MOST_EXPENSIVE]: {
    value: SortBy.MOST_EXPENSIVE,
    text: t('filters.most_expensive')
  },
  [SortBy.MAX_RENTAL_PRICE]: {
    value: SortBy.MAX_RENTAL_PRICE,
    text: t('filters.cheapest')
  },
  [SortBy.RECENTLY_LISTED]: {
    value: SortBy.RECENTLY_LISTED,
    text: t('filters.recently_listed')
  },
  [SortBy.RENTAL_LISTING_DATE]: {
    value: SortBy.RENTAL_LISTING_DATE,
    text: t('filters.recently_listed_for_rent')
  }
})

export const getStatus = createSelector<RootState, string, string>(getRouterSearch, search => getURLParam(search, 'status') || '')

export const getSortByOptions = createSelector<RootState, boolean | undefined, boolean | undefined, string, SortByOption[]>(
  getOnlyOnRent,
  getOnlyOnSale,
  getStatus,
  (onlyOnRent, onlyOnSale, status) => {
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
)

export const getIsSoldOut = createSelector<RootState, string, boolean | undefined>(getRouterSearch, search => {
  const isSoldOut = getURLParam(search, 'isSoldOut')
  return isSoldOut === 'true'
})

export const getIsMap = createSelector<RootState, string, boolean | undefined>(getRouterSearch, search => {
  const isMap = getURLParam(search, 'isMap')
  return isMap === null ? undefined : isMap === 'true'
})

export const getItemId = createSelector<RootState, string, string | undefined>(getRouterSearch, search => {
  const itemId = getURLParam(search, 'itemId')
  return itemId ? itemId : undefined
})

export const getIsFullscreen = createSelector<RootState, string, boolean | undefined, boolean | undefined>(
  getRouterSearch,
  getIsMap,
  (search, isMap) => {
    const isFullscreen = getURLParam(search, 'isFullscreen')
    return isFullscreen === null ? undefined : isMap && isFullscreen === 'true'
  }
)

export const getRarities = createSelector<RootState, string, Rarity[]>(getRouterSearch, search =>
  getURLParamArrayNonStandard<Rarity>(search, 'rarities', Object.values(Rarity).filter(value => typeof value === 'string') as string[])
)

export const getWearableGenders = createSelector<RootState, string, GenderFilterOption[]>(getRouterSearch, search =>
  getURLParamArrayNonStandard<GenderFilterOption>(search, 'genders', Object.values(GenderFilterOption))
)

export const getContracts = createSelector<RootState, string, string[]>(
  getRouterSearch,
  search => getURLParam<string>(search, 'contracts')?.split(SEARCH_ARRAY_PARAM_SEPARATOR) || []
)

export const getCreators = createSelector<RootState, string, string[]>(getRouterSearch, search =>
  getURLParamArray<string>(search, 'creators')
)

export const getSearch = createSelector<RootState, string, string>(getRouterSearch, search => getURLParam(search, 'search') || '')

export const getNetwork = createSelector<RootState, string, Network | undefined>(
  getRouterSearch,
  search => (getURLParam(search, 'network') as Network) || undefined
)

export const getAssetType = createSelector<RootState, string, string, VendorName, AssetType>(
  getRouterSearch,
  getPathName,
  getVendor,
  (search, pathname, vendor) => {
    const assetTypeParam = getURLParam(search, 'assetType') ?? ''

    if (!assetTypeParam || !(assetTypeParam.toUpperCase() in AssetType)) {
      if (vendor === VendorName.DECENTRALAND && pathname === locations.browse()) {
        return AssetType.ITEM
      }

      return AssetType.NFT
    }
    return assetTypeParam as AssetType
  }
)

export const getEmotePlayMode = createSelector<RootState, string, EmotePlayMode[] | undefined>(
  getRouterSearch,
  search => getURLParamArray<EmotePlayMode>(search, 'emotePlayMode') || undefined
)

export const getViewAsGuest = createSelector<RootState, string, boolean | undefined>(getRouterSearch, search =>
  getURLParam(search, 'viewAsGuest') ? getURLParam(search, 'viewAsGuest') === 'true' : undefined
)
export const getOnlySmart = createSelector<RootState, string, boolean | undefined>(getRouterSearch, search =>
  getURLParam(search, 'onlySmart') ? getURLParam(search, 'onlySmart') === 'true' : undefined
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

export const getRentalDays = createSelector<RootState, string, number[]>(getRouterSearch, search =>
  getURLParamArray(search, 'rentalDays').map(value => Number.parseInt(value))
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

export const getEmoteHasSound = createSelector<RootState, string, boolean>(
  getRouterSearch,
  search => getURLParam(search, 'emoteHasSound') === 'true'
)

export const getEmoteHasGeometry = createSelector<RootState, string, boolean>(
  getRouterSearch,
  search => getURLParam(search, 'emoteHasGeometry') === 'true'
)

export const getCurrentLocationAddress = createSelector<RootState, string, string | undefined, string | undefined, string | undefined>(
  getPathName,
  getWalletAddress,
  getAccountAddress,
  (pathname, walletAddress, accountAddress) => {
    let address: string | undefined

    if (pathname === locations.currentAccount()) {
      address = walletAddress
    } else {
      address = accountAddress
    }

    return address ? address.toLowerCase() : undefined
  }
)

export const getPaginationUrlParams = createSelector(getPageNumber, getSortBy, getSearch, (page, sortBy, search) => ({
  page,
  sortBy,
  search
}))

export const getAssetsUrlParams = createSelector(
  getOnlyOnSale,
  getOnlySmart,
  getIsSoldOut,
  getItemId,
  getContracts,
  getCreators,
  getSearch,
  (onlyOnSale, onlySmart, isSoldOut, itemId, contracts, creators, search) => ({
    onlyOnSale,
    onlySmart,
    isSoldOut,
    itemId,
    contracts,
    creators,
    search
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
  (isMap, isFullscreen, minEstateSize, maxEstateSize, minDistanceToPlaza, maxDistanceToPlaza, adjacentToRoad, rentalDays) => ({
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
  getStatus,
  (rarities, wearableGenders, view, viewAsGuest, minPrice, maxPrice, status) => ({
    rarities,
    wearableGenders,
    view,
    viewAsGuest,
    minPrice,
    maxPrice,
    status
  })
)

export const getEmoteUrlParams = createSelector(
  [getEmotePlayMode, getEmoteHasGeometry, getEmoteHasSound],
  (emotePlayMode, emoteHasGeometry, emoteHasSound) => ({
    emotePlayMode,
    emoteHasGeometry,
    emoteHasSound
  })
)

export const getCurrentBrowseOptions = createSelector(
  [
    getAssetType,
    getCurrentLocationAddress,
    getVendor,
    getSection,
    getNetwork,
    getPaginationUrlParams,
    getAssetsUrlParams,
    getLandsUrlParams,
    getWearablesUrlParams,
    getOnlyOnRent,
    getOnlyOnSale,
    getEmoteUrlParams
  ],
  (
    assetType,
    address,
    vendor,
    section,
    network,
    paginationUrlParams,
    AssetsUrlParams,
    landsUrlParams,
    wearablesUrlParams,
    onlyOnRent,
    onlyOnSale,
    emoteUrlParams
  ) =>
    ({
      assetType,
      address,
      vendor,
      section,
      network,
      ...emoteUrlParams,
      ...AssetsUrlParams,
      ...paginationUrlParams,
      ...landsUrlParams,
      ...wearablesUrlParams,
      onlyOnRent,
      onlyOnSale
    }) as BrowseOptions
)

export const getCurrentSearch = createSelector([getAssetsUrlParams], AssetsUrlParams => {
  const { search } = AssetsUrlParams
  return search
})

export const hasFiltersEnabled = createSelector<RootState, BrowseOptions, boolean>(getCurrentBrowseOptions, browseOptions => {
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
    emoteHasSound
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
    (!!status && status !== AssetStatusFilter.ON_SALE)
  )
})

export const getIsBuyWithCardPage = createSelector<RootState, string, boolean>(getRouterSearch, search => {
  const withCard = getURLParam(search, 'withCard')
  return withCard !== null && withCard === 'true'
})

const buildExactMatchProps = (path: string) => {
  return { path, exact: true }
}

export const getPageName = createSelector<RootState, string, PageName>(getPathName, pathname => {
  if (pathname === '/') {
    return PageName.HOME
  } else if (matchPath(pathname, buildExactMatchProps(locations.manage('anAddress', 'anId')))) {
    return PageName.MANAGE_NFT
  } else if (matchPath(pathname, buildExactMatchProps(locations.buy(AssetType.NFT)))) {
    return PageName.BUY_NFT
  } else if (matchPath(pathname, buildExactMatchProps(locations.buy(AssetType.ITEM)))) {
    return PageName.BUY_ITEM
  } else if (matchPath(pathname, buildExactMatchProps(locations.buyStatusPage(AssetType.NFT)))) {
    return PageName.BUY_NFT_STATUS
  } else if (matchPath(pathname, locations.buyStatusPage(AssetType.ITEM))) {
    return PageName.BUY_ITEM_STATUS
  } else if (matchPath(pathname, locations.cancel())) {
    return PageName.CANCEL_NFT_SALE
  } else if (matchPath(pathname, locations.transfer())) {
    return PageName.TRANSFER_NFT
  } else if (matchPath(pathname, locations.bid())) {
    return PageName.BID_NFT
  } else if (matchPath(pathname, locations.signIn())) {
    return PageName.SIGN_IN
  } else if (matchPath(pathname, locations.settings())) {
    return PageName.SETTINGS
  } else if (matchPath(pathname, locations.lands())) {
    return PageName.LANDS
  } else if (matchPath(pathname, locations.names())) {
    return PageName.NAMES
  } else if (matchPath(pathname, locations.collection())) {
    return PageName.COLLECTION
  } else if (matchPath(pathname, locations.browse())) {
    return PageName.BROWSE
  } else if (matchPath(pathname, locations.campaign())) {
    return PageName.CAMPAIGN
  } else if (matchPath(pathname, locations.currentAccount())) {
    return PageName.ACCOUNT
  } else if (matchPath(pathname, locations.list())) {
    return PageName.LIST
  } else if (matchPath(pathname, locations.lists())) {
    return PageName.LISTS
  } else if (matchPath(pathname, locations.account())) {
    return PageName.ACCOUNTS
  } else if (matchPath(pathname, locations.nft())) {
    return PageName.NFT_DETAIL
  } else if (matchPath(pathname, locations.item())) {
    return PageName.ITEM_DETAIL
  } else if (matchPath(pathname, locations.parcel())) {
    return PageName.PARCEL_DETAIL
  } else if (matchPath(pathname, locations.estate())) {
    return PageName.ESTATE_DETAIL
  } else if (matchPath(pathname, locations.activity())) {
    return PageName.ACTIVITY
  }
  throw new Error('Unknown page')
})
