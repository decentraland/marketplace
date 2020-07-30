import { takeEvery, put, select } from 'redux-saga/effects'
import { push, getLocation } from 'connected-react-router'

import { NFTCategory } from '../vendor/decentraland/nft/types'
import { Vendors } from '../vendor/types'
import { View } from '../ui/types'
import { getView } from '../ui/nft/browse/selectors'
import { getVendor } from '../routing/selectors'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { getAddress as getAccountAddress } from '../account/selectors'
import { fetchNFTsRequest } from '../nft/actions'
import { setView } from '../ui/actions'
import { getFilters } from '../vendor/utils'
import { getSortOrder } from '../nft/utils'
import { MAX_PAGE, PAGE_SIZE, getMaxQuerySize } from '../vendor/api'
import { locations } from './locations'
import {
  getSearchParams,
  getSearchCategory,
  getDefaultOptionsByView
} from './search'
import {
  getPage,
  getSection,
  getSortBy,
  getOnlyOnSale,
  getIsMap,
  getWearableRarities,
  getWearableGenders,
  getContracts,
  getSearch
} from './selectors'
import {
  BROWSE,
  BrowseAction,
  FETCH_NFTS_FROM_ROUTE,
  FetchNFTsFromRouteAction,
  setIsLoadMore
} from './actions'
import { SearchOptions } from './types'

export function* routingSaga() {
  yield takeEvery(FETCH_NFTS_FROM_ROUTE, handleFetchNFTsFromRoute)
  yield takeEvery(BROWSE, handleBrowse)
}

function* handleFetchNFTsFromRoute(action: FetchNFTsFromRouteAction) {
  const newSearchOptions = yield getNewSearchOptions(
    action.payload.searchOptions
  )
  yield fetchNFTsFromRoute(newSearchOptions)
}

function* handleBrowse(action: BrowseAction) {
  const newSearchOptions = yield getNewSearchOptions(
    action.payload.searchOptions
  )
  yield fetchNFTsFromRoute(newSearchOptions)

  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const params = getSearchParams(newSearchOptions)
  yield put(push(params ? `${pathname}?${params.toString()}` : pathname))
}

// ------------------------------------------------
// Utility functions, not handlers

function* fetchNFTsFromRoute(searchOptions: SearchOptions) {
  const view = searchOptions.view!
  const vendor = searchOptions.vendor!
  const page = searchOptions.page!
  const section = searchOptions.section!
  const sortBy = searchOptions.sortBy!
  const { search, onlyOnSale, isMap, address } = searchOptions

  const isLoadMore = view === View.LOAD_MORE

  const offset = isLoadMore ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

  const [orderBy, orderDirection] = getSortOrder(sortBy)
  const category = getSearchCategory(section)

  yield put(setIsLoadMore(isLoadMore))

  if (isMap) {
    yield put(setView(view))
  } else {
    yield put(
      fetchNFTsRequest({
        vendor,
        view,
        params: {
          first,
          skip,
          orderBy,
          orderDirection,
          onlyOnSale,
          address,
          category,
          search
        },
        filters: getFilters(vendor, searchOptions)
      })
    )
  }
}

function* getNewSearchOptions(current: SearchOptions) {
  let previous: SearchOptions = {
    address: yield getAddress(),
    vendor: yield select(getVendor),
    section: yield select(getSection),
    page: yield select(getPage),
    view: yield select(getView),
    sortBy: yield select(getSortBy),
    search: yield select(getSearch),
    onlyOnSale: yield select(getOnlyOnSale),
    isMap: yield select(getIsMap)
  }
  current = yield deriveCurrentOptions(previous, current)

  const view = deriveView(previous, current)
  const vendor = deriveVendor(previous, current)

  if (shouldResetOptions(previous, current)) {
    previous = { page: 1 }
  }

  const defaults = getDefaultOptionsByView(view)

  return {
    ...defaults,
    ...previous,
    ...current,
    view,
    vendor
  }
}

function* getAddress() {
  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  let address: string | undefined

  if (pathname === locations.currentAccount()) {
    address = yield select(getWalletAddress)
  } else {
    address = yield select(getAccountAddress)
  }

  return address
}

// TODO: Consider moving this should live to each vendor
function* deriveCurrentOptions(
  previous: SearchOptions,
  current: SearchOptions
) {
  let newOptions = { ...current }

  const nextCategory = getSearchCategory(current.section!)

  switch (nextCategory) {
    case NFTCategory.WEARABLE: {
      const prevCategory = getSearchCategory(previous.section!)

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

function deriveView(previous: SearchOptions, current: SearchOptions) {
  return previous.page! < current.page!
    ? View.LOAD_MORE
    : current.view || previous.view
}

function deriveVendor(previous: SearchOptions, current: SearchOptions) {
  return current.vendor || previous.vendor || Vendors.DECENTRALAND
}

function shouldResetOptions(previous: SearchOptions, current: SearchOptions) {
  return (
    (current.vendor && current.vendor !== previous.vendor) ||
    (current.section && current.section !== previous.section)
  )
}
