import { takeEvery, put, select } from 'redux-saga/effects'
import { push, getLocation } from 'connected-react-router'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'
import { getView } from '../ui/browse/selectors'
import {
  getIsFullscreen,
  getIsSoldOut,
  getItemId,
  getNetwork,
  getResultType,
  getVendor
} from '../routing/selectors'
import { getAddress as getWalletAddress } from '../wallet/selectors'
import { getAddress as getAccountAddress } from '../account/selectors'
import { fetchNFTsRequest } from '../nft/actions'
import { setView } from '../ui/actions'
import { getFilters } from '../vendor/utils'
import { getOrder } from '../nft/utils'
import { MAX_PAGE, PAGE_SIZE, getMaxQuerySize } from '../vendor/api'
import { locations } from './locations'
import {
  getSearchParams,
  getCategoryFromSection,
  getDefaultOptionsByView,
  getSearchWearableCategory,
  getItemSortBy
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
  BROWSE_NFTS,
  BrowseNFTsAction,
  FETCH_NFTS_FROM_ROUTE,
  FetchNFTsFromRouteAction,
  setIsLoadMore,
  FETCH_ITEMS_FROM_ROUTE,
  FetchItemsFromRouteAction,
  BROWSE_ITEMS,
  BrowseItemsAction
} from './actions'
import { NFTBrowseOptions, Section } from './types'
import { AssetType } from '../asset/types'
import { ItemBrowseOptions } from '../item/types'
import { fetchItemsRequest } from '../item/actions'
import { ItemSortBy } from '../vendor/decentraland/item/types'
import { WearableGender } from '../nft/wearable/types'

export function* routingSaga() {
  yield takeEvery(FETCH_NFTS_FROM_ROUTE, handleFetchNFTsFromRoute)
  yield takeEvery(FETCH_ITEMS_FROM_ROUTE, handleFetchItemsFromRoute)
  yield takeEvery(BROWSE_NFTS, handleBrowseNFTs)
  yield takeEvery(BROWSE_ITEMS, handleBrowseItems)
}

function* handleFetchNFTsFromRoute(action: FetchNFTsFromRouteAction) {
  const newSearchOptions: NFTBrowseOptions = yield getNFTBrowseOptions(
    action.payload.searchOptions
  )
  yield fetchNFTsFromRoute(newSearchOptions)
}

function* handleBrowseNFTs(action: BrowseNFTsAction) {
  const options: NFTBrowseOptions = yield getNFTBrowseOptions(
    action.payload.searchOptions
  )
  yield fetchNFTsFromRoute(options)

  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const params = getSearchParams(options)
  yield put(push(params ? `${pathname}?${params.toString()}` : pathname))
}

function* handleFetchItemsFromRoute(action: FetchItemsFromRouteAction) {
  const options: ItemBrowseOptions = yield getItemBrowseOptions(action.payload)
  yield fetchItemsFromRoute(options)
}

function* handleBrowseItems(action: BrowseItemsAction) {
  const options: ItemBrowseOptions = yield getItemBrowseOptions(action.payload)
  yield fetchItemsFromRoute(options)

  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const params = getSearchParams(options)
  yield put(push(params ? `${pathname}?${params.toString()}` : pathname))
}

// ------------------------------------------------
// Utility functions, not handlers

function* fetchNFTsFromRoute(searchOptions: NFTBrowseOptions) {
  const isItems = searchOptions.resultType === AssetType.ITEM
  const view = searchOptions.view!
  const vendor = searchOptions.vendor!
  const page = searchOptions.page!
  const section = searchOptions.section!
  const sortBy = searchOptions.sortBy!
  const { search, onlyOnSale, isMap } = searchOptions

  const address = searchOptions.address || ((yield getAddress()) as string)

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

    const { wearableRarities, wearableGenders } = searchOptions

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
    const [orderBy, orderDirection] = getOrder(sortBy)
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
        filters: getFilters(vendor, searchOptions) // TODO: move to routing
      })
    )
  }
}

function* getNFTBrowseOptions(
  current: NFTBrowseOptions
): Generator<unknown, NFTBrowseOptions, any> {
  let previous: NFTBrowseOptions = {
    resultType: yield select(getResultType),
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

function* fetchItemsFromRoute(options: ItemBrowseOptions) {
  const view = options.view!
  const page = options.page!

  const isLoadMore = view === View.LOAD_MORE

  const offset = isLoadMore ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, 1000)

  yield put(setIsLoadMore(isLoadMore))
  yield put(
    fetchItemsRequest({
      view,
      page,
      filters: {
        first,
        skip,
        ...options.filters
      }
    })
  )
}

function* getItemBrowseOptions(_current: ItemBrowseOptions) {
  const section: Section | undefined = yield select(getSection)
  const isWearableHead =
    section === Section[VendorName.DECENTRALAND].WEARABLES_HEAD
  const isWearableAccessory =
    section === Section[VendorName.DECENTRALAND].WEARABLES_ACCESORIES
  const wearableCategory = !isWearableAccessory
    ? getSearchWearableCategory(section!)
    : undefined
  const options: ItemBrowseOptions = {
    page: yield select(getPage),
    view: yield select(getView),
    filters: {
      creator: (yield getAddress()) as string, //TODO: fix me, this only works in /account but not in /account/:address
      sortBy: (yield select(getSortBy)) as ItemSortBy,
      search: (yield select(getSearch)) as string,
      isOnSale: (yield select(getOnlyOnSale)) as boolean,
      rarities: (yield select(getWearableRarities)) as Rarity[],
      wearableGenders: (yield select(getWearableGenders)) as WearableGender[],
      isWearableHead,
      isWearableAccessory,
      wearableCategory,
      isSoldOut: (yield select(getIsSoldOut)) as boolean,
      itemId: (yield select(getItemId)) as string,
      contractAddress: ((yield select(getContracts)) as string[])[0],
      network: yield select(getNetwork)
    }
  }

  return options
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
  previous: NFTBrowseOptions,
  current: NFTBrowseOptions
) {
  let newOptions = {
    ...current,
    resultType: current.resultType || previous.resultType,
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
      newOptions = { ...newOptions, resultType: AssetType.NFT }
    }
  }

  return newOptions
}

function deriveView(previous: NFTBrowseOptions, current: NFTBrowseOptions) {
  return previous.page! < current.page!
    ? View.LOAD_MORE
    : current.view || previous.view
}

function deriveVendor(previous: NFTBrowseOptions, current: NFTBrowseOptions) {
  return current.vendor || previous.vendor || VendorName.DECENTRALAND
}

function shouldResetOptions(
  previous: NFTBrowseOptions,
  current: NFTBrowseOptions
) {
  return (
    (current.vendor && current.vendor !== previous.vendor) ||
    (current.section && current.section !== previous.section) ||
    (current.resultType && current.resultType !== previous.resultType)
  )
}
