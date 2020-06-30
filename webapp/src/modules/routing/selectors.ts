import { createSelector } from 'reselect'
import { getSearch as getRouterSearch } from 'connected-react-router'
import { RootState } from '../reducer'
import { WearableRarity, WearableGender } from '../nft/wearable/types'
import { ContractName } from '../vendor/types'
import { contractAddresses } from '../contract/utils'
import { SortBy, Section, getParamArray } from './search'

export const getState = (state: RootState) => state.routing
export const getIsLoadMore = (state: RootState) => getState(state).isLoadMore

export const getSection = createSelector<RootState, string, Section>(
  getRouterSearch,
  search => {
    const section = new URLSearchParams(search).get('section')
    if (section && Object.values(Section).includes(section as any)) {
      return section as Section
    }
    return Section.ALL
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
