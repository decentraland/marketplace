import { createSelector } from 'reselect'
import {
  getSearch as getRouterSearch,
  getLocation
} from 'connected-react-router'
import { Network, Rarity } from '@dcl/schemas'
import { getView } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { WearableGender } from '../nft/wearable/types'
import { VendorName } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { contracts } from '../contract/utils'
import { RootState } from '../reducer'
import {
  getDefaultOptionsByView,
  getURLParamArray,
  getURLParam
} from './search'
import { SortBy, Section } from './types'
import { locations } from './locations'
import { AssetType } from '../asset/types'

export const getState = (state: RootState) => state.routing

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
  string
>(getRouterSearch, getPathName, getVendor, (search, pathname, vendor) => {
  const section = getURLParam<string>(search, 'section')
  if (!section && pathname === locations.lands()) {
    return Section.decentraland.LAND
  }

  return getURLParam<string>(search, 'section') || Section[vendor].ALL
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
  SortBy | undefined
>(
  getRouterSearch,
  getView,
  (search, view) =>
    getURLParam<SortBy>(search, 'sortBy') ||
    getDefaultOptionsByView(view).sortBy
)

export const getOnlyOnSale = createSelector<
  RootState,
  string,
  View | undefined,
  boolean | undefined
>(getRouterSearch, getView, (search, view) => {
  const onlyOnSale = getURLParam(search, 'onlyOnSale')
  let result: boolean
  switch (onlyOnSale) {
    case 'true':
      result = true
      break
    case 'false':
      result = false
      break
    default:
      const defaultOptions = getDefaultOptionsByView(view)
      result = defaultOptions.onlyOnSale!
      break
  }
  return result
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
    const itemId = getURLParam(search, 'isSoldOut')
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

export const getWearableRarities = createSelector<RootState, string, Rarity[]>(
  getRouterSearch,
  search =>
    getURLParamArray<Rarity>(
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
  WearableGender[]
>(getRouterSearch, search =>
  getURLParamArray<WearableGender>(
    search,
    'genders',
    Object.values(WearableGender)
  )
)

export const getContracts = createSelector<RootState, string, string[]>(
  getRouterSearch,
  search =>
    getURLParamArray<string>(
      search,
      'contracts',
      contracts.map(contract => contract.address)
    )
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
  AssetType
>(getRouterSearch, getPathName, (search, pathname) => {
  let results = getURLParam(search, 'assetType') as AssetType
  if (!results) {
    results = pathname === locations.browse() ? AssetType.ITEM : AssetType.NFT
  }
  return results
})

export const hasFiltersEnabled = createSelector<
  RootState,
  string | undefined,
  WearableGender[],
  Rarity[],
  string[],
  boolean
>(
  getNetwork,
  getWearableGenders,
  getWearableRarities,
  getContracts,
  (network, genders, rarities, contracts) => {
    const hasNetworkFilter = network !== undefined
    const hasGenderFilter = genders.length > 0
    const hasRarityFilter = rarities.length > 0
    const hasContractsFilter = contracts.length > 0
    return (
      hasNetworkFilter ||
      hasGenderFilter ||
      hasRarityFilter ||
      hasContractsFilter
    )
  }
)
