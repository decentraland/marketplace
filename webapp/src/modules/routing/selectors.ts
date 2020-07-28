import { createSelector } from 'reselect'
import { getSearch as getRouterSearch } from 'connected-react-router'
import { getView } from '../ui/selectors'
import { View } from '../ui/types'
import { WearableRarity, WearableGender } from '../nft/wearable/types'
import { ContractName, Vendors } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { contractAddresses } from '../contract/utils'
import { RootState } from '../reducer'
import {
  getDefaultOptionsByView,
  getURLParamArray,
  getURLParam
} from './search'
import { SortBy, Section } from './types'

export const getState = (state: RootState) => state.routing

export const getVendor = createSelector<RootState, string, Vendors>(
  getRouterSearch,
  search => {
    const vendor = getURLParam<Vendors>(search, 'vendor')
    if (vendor && isVendor(vendor)) {
      return vendor
    }
    return Vendors.DECENTRALAND
  }
)

export const getSection = createSelector<RootState, string, Vendors, Section>(
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
  return onlyOnSale === null
    ? view
      ? getDefaultOptionsByView(view).onlyOnSale
      : undefined
    : onlyOnSale === 'true'
})

export const getIsMap = createSelector<RootState, string, boolean | undefined>(
  getRouterSearch,
  search => {
    const isMap = getURLParam(search, 'isMap')
    return isMap === null ? undefined : isMap === 'true'
  }
)

export const getWearableRarities = createSelector<
  RootState,
  string,
  WearableRarity[]
>(getRouterSearch, search =>
  getURLParamArray<WearableRarity>(
    search,
    'rarities',
    Object.values(WearableRarity)
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

export const getContracts = createSelector<RootState, string, ContractName[]>(
  getRouterSearch,
  search =>
    getURLParamArray<ContractName>(
      search,
      'contracts',
      Object.keys(contractAddresses)
    )
)

export const getSearch = createSelector<RootState, string, string>(
  getRouterSearch,
  search => getURLParam(search, 'search') || ''
)
