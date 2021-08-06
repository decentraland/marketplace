import { takeEvery, put, select } from 'redux-saga/effects'
import { push, getLocation } from 'connected-react-router'
import { NFTCategory } from '@dcl/schemas'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'
import { getView } from '../ui/browse/selectors'
import {
  getIsFullscreen,
  getNetwork,
  getAssetType,
  getVendor
} from '../routing/selectors'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { getAddress as getAccountAddress } from '../account/selectors'
import { fetchNFTsRequest } from '../nft/actions'
import { setView } from '../ui/actions'
import { getFilters } from '../vendor/utils'
import { MAX_PAGE, PAGE_SIZE, getMaxQuerySize } from '../vendor/api'
import { locations } from './locations'
import {
  getSearchParams,
  getCategoryFromSection,
  getDefaultOptionsByView,
  getSearchWearableCategory,
  getItemSortBy,
  getAssetOrderBy
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
  FETCH_ASSETS_FROM_ROUTE,
  FetchAssetsFromRouteAction,
  setIsLoadMore
} from './actions'
import { BrowseOptions, Section } from './types'
import { AssetType } from '../asset/types'
import { fetchItemsRequest } from '../item/actions'

export function* routingSaga() {
  yield takeEvery(FETCH_ASSETS_FROM_ROUTE, handleFetchAssetsFromRoute)
  yield takeEvery(BROWSE, handleBrowse)
}

function* handleFetchAssetsFromRoute(action: FetchAssetsFromRouteAction) {
  const newOptions: BrowseOptions = yield getNewBrowseOptions(
    action.payload.options
  )
  yield fetchAssetsFromRoute(newOptions)
}

function* handleBrowse(action: BrowseAction) {
  const options: BrowseOptions = yield getNewBrowseOptions(
    action.payload.options
  )
  yield fetchAssetsFromRoute(options)

  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const params = getSearchParams(options)
  yield put(push(params ? `${pathname}?${params.toString()}` : pathname))
}

// ------------------------------------------------
// Utility functions, not handlers

function* fetchAssetsFromRoute(options: BrowseOptions) {
  const isItems = options.assetType === AssetType.ITEM
  const view = options.view!
  const vendor = options.vendor!
  const page = options.page!
  const section = options.section!
  const sortBy = options.sortBy!
  const { search, onlyOnSale, isMap } = options

  const address = options.address || ((yield getAddress()) as string)

  const isLoadMore = view === View.LOAD_MORE

  const offset = isLoadMore ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

  yield put(setIsLoadMore(isLoadMore))

  if (isMap) {
    yield put(setView(view))
  }
  if (isItems) {
    // TODO: clean up
    const isWearableHead =
      section === Section[VendorName.DECENTRALAND].WEARABLES_HEAD
    const isWearableAccessory =
      section === Section[VendorName.DECENTRALAND].WEARABLES_ACCESORIES

    const wearableCategory = !isWearableAccessory
      ? getSearchWearableCategory(section!)
      : undefined

    const { wearableRarities, wearableGenders } = options

    yield put(
      fetchItemsRequest({
        view,
        page,
        filters: {
          first,
          skip,
          sortBy: getItemSortBy(sortBy),
          isOnSale: onlyOnSale,
          creator: address,
          wearableCategory,
          isWearableHead,
          isWearableAccessory,
          search,
          rarities: wearableRarities,
          wearableGenders
        }
      })
    )
  } else {
    const [orderBy, orderDirection] = getAssetOrderBy(sortBy)
    const category = getCategoryFromSection(section)
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
        filters: getFilters(vendor, options) // TODO: move to routing
      })
    )
  }
}

function* getNewBrowseOptions(
  current: BrowseOptions
): Generator<unknown, BrowseOptions, any> {
  let previous: BrowseOptions = {
    assetType: yield select(getAssetType),
    address: yield getAddress(),
    vendor: yield select(getVendor),
    section: yield select(getSection),
    page: yield select(getPage),
    view: yield select(getView),
    sortBy: yield select(getSortBy),
    search: yield select(getSearch),
    onlyOnSale: yield select(getOnlyOnSale),
    isMap: yield select(getIsMap),
    isFullscreen: yield select(getIsFullscreen),
    wearableRarities: yield select(getWearableRarities),
    wearableGenders: yield select(getWearableGenders),
    contracts: yield select(getContracts),
    network: yield select(getNetwork)
  }
  current = yield deriveCurrentOptions(previous, current)
  const view = deriveView(previous, current)
  const vendor = deriveVendor(previous, current)

  if (shouldResetOptions(previous, current)) {
    previous = {
      page: 1,
      onlyOnSale: previous.onlyOnSale,
      sortBy: previous.sortBy,
      isMap: previous.isMap,
      isFullscreen: previous.isFullscreen
    }
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

  return address ? address.toLowerCase() : undefined
}

// TODO: Consider moving this should live to each vendor
function* deriveCurrentOptions(
  previous: BrowseOptions,
  current: BrowseOptions
) {
  let newOptions = {
    ...current,
    assetType: current.assetType || previous.assetType,
    section: current.section || previous.section
  }

  const nextCategory = getCategoryFromSection(newOptions.section!)

  switch (nextCategory) {
    case NFTCategory.WEARABLE: {
      const prevCategory = getCategoryFromSection(previous.section!)

      // Category specific logic to keep filters if the category doesn't change
      if (prevCategory && prevCategory === nextCategory) {
        newOptions = {
          wearableRarities: yield select(getWearableRarities),
          wearableGenders: yield select(getWearableGenders),
          contracts: yield select(getContracts),
          search: yield select(getSearch),
          network: yield select(getNetwork),
          ...newOptions
        }
      }
      break
    }
    default: {
      newOptions = { ...newOptions, assetType: AssetType.NFT }
    }
  }

  return newOptions
}

function deriveView(previous: BrowseOptions, current: BrowseOptions) {
  return previous.page! < current.page!
    ? View.LOAD_MORE
    : current.view || previous.view
}

function deriveVendor(previous: BrowseOptions, current: BrowseOptions) {
  return current.vendor || previous.vendor || VendorName.DECENTRALAND
}

function shouldResetOptions(previous: BrowseOptions, current: BrowseOptions) {
  return (
    (current.vendor && current.vendor !== previous.vendor) ||
    (current.section && current.section !== previous.section) ||
    (current.assetType && current.assetType !== previous.assetType)
  )
}
