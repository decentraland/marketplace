import { createSelector } from 'reselect'
import { getSearch as getRouterSearch } from 'connected-react-router'
import { Network, Rarity } from '@dcl/schemas'
import { getView } from '../ui/nft/browse/selectors'
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

export const getState = (state: RootState) => state.routing

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
  VendorName,
  Section
>(
  getRouterSearch,
  getVendor,
  (search, vendor) =>
    getURLParam<Section>(search, 'section') || Section[vendor].ALL
)

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

export const getIsMap = createSelector<RootState, string, boolean | undefined>(
  getRouterSearch,
  search => {
    const isMap = getURLParam(search, 'isMap')
    return isMap === null ? undefined : isMap === 'true'
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
