import { takeEvery, put, select } from 'redux-saga/effects'
import { push, getLocation } from 'connected-react-router'

import { NFTCategory } from '../vendor/decentraland/nft/types'
import { Vendors } from '../vendor/types'
import { View } from '../ui/types'
import { getView } from '../ui/selectors'
import { getVendor } from '../routing/selectors'
import { fetchNFTsRequest } from '../nft/actions'
import { getFilters } from '../vendor/utils'
import { getSortOrder } from '../nft/utils'
import { MAX_PAGE, PAGE_SIZE, getMaxQuerySize } from '../vendor/api'
import {
  getPage,
  getSection,
  getSortBy,
  getOnlyOnSale,
  getWearableRarities,
  getWearableGenders,
  getContracts,
  getSearch
} from './selectors'
import { getSearchParams, getSearchCategory } from './search'
import { BROWSE, BrowseAction, setIsLoadMore } from './actions'
import { SearchOptions } from './types'

export function* routingSaga() {
  yield takeEvery(BROWSE, handleBrowse)
}

function* handleBrowse(action: BrowseAction) {
  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)

  const searchOptions = yield getNewSearchOptions(action.payload.searchOptions)
  const {
    view,
    vendor,
    page,
    section,
    sortBy,
    search,
    onlyOnSale,
    address
  } = searchOptions
  const isLoadMore = view === View.LOAD_MORE

  if (isLoadMore) {
    // Keep search if section is not changing
    searchOptions.search = search
  }

  const params = getSearchParams(searchOptions)

  const offset = isLoadMore ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

  const [orderBy, orderDirection] = getSortOrder(sortBy)
  const category = getSearchCategory(section)

  yield put(setIsLoadMore(isLoadMore))
  yield put(push(params ? `${pathname}?${params.toString()}` : pathname))
  yield put(
    fetchNFTsRequest({
      vendor,
      view,
      params: {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale: onlyOnSale,
        address,
        category,
        search
      },
      filters: getFilters(vendor, searchOptions)
    })
  )
}

function* getNewSearchOptions(currentOptions: SearchOptions) {
  const previousOptions: SearchOptions = {
    vendor: yield select(getVendor),
    page: yield select(getPage),
    view: yield select(getView),
    section: yield select(getSection),
    sortBy: yield select(getSortBy),
    search: yield select(getSearch),
    onlyOnSale: yield select(getOnlyOnSale)
  }
  currentOptions = yield onSearchOptionsUpdate(previousOptions, currentOptions)

  const view =
    previousOptions.page! < currentOptions.page!
      ? View.LOAD_MORE
      : currentOptions.view || previousOptions.view

  const vendor =
    currentOptions.vendor || previousOptions.vendor || Vendors.DECENTRALAND

  return {
    ...previousOptions,
    ...currentOptions,
    view,
    vendor
  }
}

// TODO: Maybe this should live in vendor
function* onSearchOptionsUpdate(
  previousOptions: SearchOptions,
  currentOptions: SearchOptions
) {
  let newOptions = { ...currentOptions }

  const nextCategory = getSearchCategory(currentOptions.section!)

  switch (nextCategory) {
    case NFTCategory.WEARABLE: {
      const prevCategory = getSearchCategory(previousOptions.section!)

      // Category specific logic to keep filters if the category doesn't change
      if (prevCategory && prevCategory === nextCategory) {
        newOptions = {
          wearableRarities: yield select(getWearableRarities),
          wearableGenders: yield select(getWearableGenders),
          contracts: yield select(getContracts),
          search: yield select(getSearch),
          ...newOptions
        }
      }
    }
  }

  return newOptions
}
