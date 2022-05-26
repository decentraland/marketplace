import {
  takeEvery,
  put,
  select,
  call,
  take,
  delay,
  race,
  spawn
} from 'redux-saga/effects'
import {
  push,
  getLocation,
  goBack,
  LOCATION_CHANGE,
  replace
} from 'connected-react-router'
import { NFTCategory, Sale, SaleSortBy, SaleType } from '@dcl/schemas'
import { omit } from '../../lib/utils'
import { AssetType } from '../asset/types'
import {
  BUY_ITEM_SUCCESS,
  fetchItemRequest,
  fetchItemsRequest
} from '../item/actions'
import { VendorName } from '../vendor/types'
import { View } from '../ui/types'
import {
  getNetwork,
  getOnlySmart,
  getCurrentBrowseOptions,
  getCurrentLocationAddress
} from '../routing/selectors'
import {
  fetchNFTRequest,
  fetchNFTsRequest,
  TRANSFER_NFT_SUCCESS
} from '../nft/actions'
import { setView } from '../ui/actions'
import { getFilters } from '../vendor/utils'
import {
  MAX_PAGE,
  PAGE_SIZE,
  getMaxQuerySize,
  MAX_QUERY_SIZE
} from '../vendor/api'
import { locations } from './locations'
import {
  getCategoryFromSection,
  getDefaultOptionsByView,
  getSearchWearableCategory,
  getItemSortBy,
  getAssetOrderBy,
  getCollectionSortBy
} from './search'
import {
  getRarities,
  getWearableGenders,
  getContracts,
  getSearch
} from './selectors'
import {
  BROWSE,
  BrowseAction,
  FETCH_ASSETS_FROM_ROUTE,
  FetchAssetsFromRouteAction,
  setIsLoadMore,
  CLEAR_FILTERS,
  GO_BACK,
  GoBackAction
} from './actions'
import { BrowseOptions, Sections, SortBy } from './types'
import { Section } from '../vendor/decentraland'
import { fetchCollectionsRequest } from '../collection/actions'
import { COLLECTIONS_PER_PAGE, SALES_PER_PAGE } from './utils'
import {
  FetchSalesFailureAction,
  fetchSalesRequest,
  FETCH_SALES_FAILURE,
  FETCH_SALES_SUCCESS
} from '../sale/actions'
import { getSales } from '../sale/selectors'
import {
  CANCEL_ORDER_SUCCESS,
  CREATE_ORDER_SUCCESS,
  EXECUTE_ORDER_SUCCESS
} from '../order/actions'
import {
  ACCEPT_BID_SUCCESS,
  CANCEL_BID_SUCCESS,
  PLACE_BID_SUCCESS
} from '../bid/actions'
import { buildBrowseURL } from './utils'

export function* routingSaga() {
  yield takeEvery(FETCH_ASSETS_FROM_ROUTE, handleFetchAssetsFromRoute)
  yield takeEvery(BROWSE, handleBrowse)
  yield takeEvery(CLEAR_FILTERS, handleClearFilters)
  yield takeEvery(GO_BACK, handleGoBack)
  yield takeEvery(
    [
      CREATE_ORDER_SUCCESS,
      EXECUTE_ORDER_SUCCESS,
      CANCEL_ORDER_SUCCESS,
      PLACE_BID_SUCCESS,
      ACCEPT_BID_SUCCESS,
      CANCEL_BID_SUCCESS,
      BUY_ITEM_SUCCESS,
      TRANSFER_NFT_SUCCESS
    ],
    handleRedirectToActivity
  )
}

function* handleFetchAssetsFromRoute(action: FetchAssetsFromRouteAction) {
  const newOptions: BrowseOptions = yield getNewBrowseOptions(
    action.payload.options
  )
  yield fetchAssetsFromRoute(newOptions)
}

function* handleClearFilters() {
  const browseOptions: BrowseOptions = yield select(getCurrentBrowseOptions)
  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)

  const clearedBrowseOptions: BrowseOptions = omit(browseOptions, [
    'rarities',
    'wearableGenders',
    'network',
    'contracts',
    'page'
  ])

  yield call(fetchAssetsFromRoute, clearedBrowseOptions)
  yield put(push(buildBrowseURL(pathname, clearedBrowseOptions)))
}

export function* handleBrowse(action: BrowseAction) {
  const options: BrowseOptions = yield call(
    getNewBrowseOptions,
    action.payload.options
  )
  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)

  yield fetchAssetsFromRoute(options)
  yield put(push(buildBrowseURL(pathname, options)))
}

function* handleGoBack(action: GoBackAction) {
  const { defaultLocation } = action.payload

  yield put(goBack())

  const { timeout }: { timeout?: boolean } = yield race({
    changed: take(LOCATION_CHANGE),
    timeout: delay(250)
  })

  if (timeout) {
    yield put(replace(defaultLocation || locations.root()))
  }
}

export function* fetchAssetsFromRoute(options: BrowseOptions) {
  const isItems = options.assetType === AssetType.ITEM
  const view = options.view!
  const vendor = options.vendor!
  const page = options.page!
  const section = options.section!
  const sortBy = options.sortBy!
  const { search, onlyOnSale, onlySmart, isMap, contracts } = options

  const address =
    options.address || ((yield select(getCurrentLocationAddress)) as string)

  const isLoadMore = view === View.LOAD_MORE

  yield put(setIsLoadMore(isLoadMore))

  if (isMap) {
    yield put(setView(view))
  }

  const category = getCategoryFromSection(section)

  switch (section) {
    case Section.BIDS:
    case Section.STORE_SETTINGS:
      break
    case Section.ON_SALE:
      yield handleFetchOnSale(address, options.view!)
      break
    case Section.SALES:
      yield spawn(handleFetchSales, address, page)
      break
    case Section.COLLECTIONS:
      yield handleFetchCollections(page, address, sortBy, search)
      break
    default:
      const offset = isLoadMore ? page - 1 : 0
      const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
      const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

      if (isItems) {
        // TODO: clean up
        const isWearableHead =
          section === Sections[VendorName.DECENTRALAND].WEARABLES_HEAD
        const isWearableAccessory =
          section === Sections[VendorName.DECENTRALAND].WEARABLES_ACCESSORIES

        const wearableCategory = !isWearableAccessory
          ? getSearchWearableCategory(section)
          : undefined

        const { rarities, wearableGenders } = options

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
              isWearableSmart: onlySmart,
              search,
              category,
              rarities: rarities,
              contractAddress: contracts && contracts[0],
              wearableGenders
            }
          })
        )
      } else {
        const [orderBy, orderDirection] = getAssetOrderBy(sortBy)
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
}

export function* getNewBrowseOptions(
  current: BrowseOptions
): Generator<unknown, BrowseOptions, any> {
  let previous: BrowseOptions = yield select(getCurrentBrowseOptions)
  current = yield deriveCurrentOptions(previous, current)
  const view = deriveView(previous, current)
  const vendor = deriveVendor(previous, current)

  if (shouldResetOptions(previous, current)) {
    previous = {
      page: 1,
      onlyOnSale: previous.onlyOnSale,
      sortBy: previous.sortBy,
      isMap: previous.isMap,
      isFullscreen: previous.isFullscreen,
      viewAsGuest: previous.viewAsGuest
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

function* handleFetchOnSale(address: string, view: View) {
  yield put(
    fetchItemsRequest({
      filters: { creator: address, isOnSale: true }
    })
  )

  yield put(
    fetchNFTsRequest({
      view,
      vendor: VendorName.DECENTRALAND,
      params: { first: MAX_QUERY_SIZE, skip: 0, onlyOnSale: true, address }
    })
  )
}

function* handleFetchSales(address: string, page: number) {
  yield put(
    fetchSalesRequest({
      first: SALES_PER_PAGE,
      skip: (page - 1) * SALES_PER_PAGE,
      seller: address,
      sortBy: SaleSortBy.RECENTLY_SOLD
    })
  )

  const result: { failure: FetchSalesFailureAction } = yield race({
    success: take(FETCH_SALES_SUCCESS),
    failure: take(FETCH_SALES_FAILURE)
  })

  if (result.failure) {
    return
  }

  const sales: ReturnType<typeof getSales> = yield select(getSales)

  const { itemSales, tokenSales } = sales.reduce(
    (acc: { itemSales: Sale[]; tokenSales: Sale[] }, sale) => {
      if (sale.type === SaleType.MINT) {
        acc.itemSales.push(sale)
      } else {
        acc.tokenSales.push(sale)
      }
      return acc
    },
    { itemSales: [], tokenSales: [] }
  )

  for (const itemSale of itemSales) {
    yield put(fetchItemRequest(itemSale.contractAddress, itemSale.itemId!))
  }

  for (const tokenSale of tokenSales) {
    yield put(fetchNFTRequest(tokenSale.contractAddress, tokenSale.tokenId))
  }
}

function* handleFetchCollections(
  page: number,
  creator: string,
  sortBy: SortBy,
  search?: string
) {
  yield put(
    fetchCollectionsRequest(
      {
        first: COLLECTIONS_PER_PAGE,
        skip: (page - 1) * COLLECTIONS_PER_PAGE,
        creator,
        search,
        sortBy: getCollectionSortBy(sortBy)
      },
      true
    )
  )
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
          rarities: yield select(getRarities),
          wearableGenders: yield select(getWearableGenders),
          search: yield select(getSearch),
          network: yield select(getNetwork),
          contracts: yield select(getContracts),
          onlySmart: yield select(getOnlySmart),
          ...newOptions
        }
      }
      break
    }
    case NFTCategory.EMOTE: {
      const prevCategory = getCategoryFromSection(previous.section!)

      // Category specific logic to keep filters if the category doesn't change
      if (prevCategory && prevCategory === nextCategory) {
        newOptions = {
          rarities: yield select(getRarities),
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

function* handleRedirectToActivity() {
  yield put(push(locations.activity()))
}
