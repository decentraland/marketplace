import { createSelector } from 'reselect'
import { getSearch as getRouterSearch } from 'connected-react-router'
import { RootState } from '../reducer'
import { WearableRarity, WearableGender } from '../nft/wearable/types'
import { ContractName, Vendors } from '../vendor/types'
import { isVendor } from '../vendor/utils'
import { contractAddresses } from '../contract/utils'
import { getParamArray } from './search'
import { SortBy, Section } from './types'

export const getState = (state: RootState) => state.routing
export const getIsLoadMore = (state: RootState) => getState(state).isLoadMore

export const getVendor = createSelector<RootState, string, Vendors>(
  getRouterSearch,
  search => {
    const vendor = new URLSearchParams(search).get('vendor') as Vendors | null
    if (vendor && isVendor(vendor)) {
      return vendor
    }
    return Vendors.DECENTRALAND
  }
)

export const getSection = createSelector<RootState, string, Vendors, Section>(
  getRouterSearch,
  getVendor,
  (search, vendor) => {
    const section = new URLSearchParams(search).get('section') as Section | null
    if (section) {
      return section
    }
    return Section[vendor].ALL
  }
)

export const getPage = createSelector<RootState, string, number>(
  getRouterSearch,
  search => {
    const page = new URLSearchParams(search).get('page')
    return page === null || isNaN(+page) ? 1 : +page
  }
)

export const getSortBy = createSelector<RootState, string, SortBy>(
  getRouterSearch,
  search => {
    const sortBy = new URLSearchParams(search).get('sortBy')
    if (sortBy) {
      return sortBy as SortBy
    }
    return SortBy.RECENTLY_LISTED
  }
)

export const getOnlyOnSale = createSelector<
  RootState,
  string,
  boolean | undefined
>(getRouterSearch, search => {
  const onlyOnSale = new URLSearchParams(search).get('onlyOnSale')
  return onlyOnSale === null ? undefined : onlyOnSale === 'true'
})

export const getIsMap = createSelector<RootState, string, boolean | undefined>(
  getRouterSearch,
  search => {
    const isMap = new URLSearchParams(search).get('isMap')
    return isMap === null ? undefined : isMap === 'true'
  }
)

export const getWearableRarities = createSelector<
  RootState,
  string,
  WearableRarity[]
>(getRouterSearch, search =>
  getParamArray<WearableRarity>(
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
  getParamArray<WearableGender>(
    search,
    'genders',
    Object.values(WearableGender)
  )
)

export const getContracts = createSelector<RootState, string, ContractName[]>(
  getRouterSearch,
  search =>
    getParamArray<ContractName>(
      search,
      'contracts',
      Object.keys(contractAddresses)
    )
)

export const getSearch = createSelector<RootState, string, string>(
  getRouterSearch,
  search => new URLSearchParams(search).get('search') || ''
)
