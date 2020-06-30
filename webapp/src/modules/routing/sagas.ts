import { takeEvery, put, select } from 'redux-saga/effects'
import { push, getLocation } from 'connected-react-router'

import { View } from '../ui/types'
import { Vendors } from '../vendor/types'
import { getView } from '../ui/selectors'
import { fetchNFTsRequest } from '../nft/actions'
import { NFTCategory } from '../nft/types'
import { getFilters } from '../vendor/utils'
import { MAX_QUERY_SIZE, MAX_PAGE, PAGE_SIZE, getSortOrder } from '../nft/utils'
import {
  getPage,
  getSection,
  getSortBy,
  getSearch,
  getOnlyOnSale,
  getWearableRarities,
  getWearableGenders,
  getContracts
} from './selectors'
import { SearchOptions, getSearchParams, getSearchCategory } from './search'
import { BROWSE, BrowseAction, setIsLoadMore } from './actions'

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

  const offset = isLoadMore ? page! - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page! * PAGE_SIZE - skip, MAX_QUERY_SIZE)

  const [orderBy, orderDirection] = getSortOrder(sortBy!)
  const category = getSearchCategory(section!)

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
        onlyOnSale: onlyOnSale!,
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
    page: yield select(getPage),
    view: yield select(getView),
    section: yield select(getSection),
    sortBy: yield select(getSortBy),
    search: yield select(getSearch),
    onlyOnSale: yield select(getOnlyOnSale)
  }
  currentOptions = yield applyVendorLogic(previousOptions, currentOptions)

  const view =
    previousOptions.page! < currentOptions.page!
      ? View.LOAD_MORE
      : currentOptions.view || previousOptions.view!

  const vendor = currentOptions.vendor || Vendors.DECENTRALAND

  return {
    ...previousOptions,
    ...currentOptions,
    view,
    vendor
  }
}

function* applyVendorLogic(
  previousOptions: SearchOptions,
  currentOptions: SearchOptions
) {
  const prevCategory = previousOptions.section
    ? getSearchCategory(previousOptions.section)
    : null
  const nextCategory = currentOptions.section
    ? getSearchCategory(currentOptions.section)
    : null

  let newOptions = { ...currentOptions }

  // Category specific logic to keep filters if the category doesn't change
  if (prevCategory && prevCategory === nextCategory) {
    switch (nextCategory) {
      case NFTCategory.WEARABLE: {
        newOptions = {
          search: yield select(getSearch),
          wearableRarities: yield select(getWearableRarities),
          wearableGenders: yield select(getWearableGenders),
          contracts: yield select(getContracts),
          ...newOptions
        }
      }
    }
  }

  return newOptions
}
