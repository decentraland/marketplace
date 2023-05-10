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
  replace,
  LocationChangeAction
} from 'connected-react-router'
import {
  NFTCategory,
  RentalStatus,
  Sale,
  SaleSortBy,
  SaleType
} from '@dcl/schemas'
import { AssetType } from '../asset/types'
import {
  BUY_ITEM_SUCCESS,
  fetchItemRequest,
  fetchItemsRequest,
  fetchTrendingItemsRequest
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
  getCollectionSortBy,
  getSearchEmoteCategory
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
  fetchAssetsFromRoute as fetchAssetsFromRouteAction,
  FetchAssetsFromRouteAction,
  CLEAR_FILTERS,
  GO_BACK,
  GoBackAction
} from './actions'
import { BrowseOptions, Sections, SortBy } from './types'
import { Section } from '../vendor/decentraland'
import { fetchCollectionsRequest } from '../collection/actions'
import {
  COLLECTIONS_PER_PAGE,
  getClearedBrowseOptions,
  rentalFilters,
  SALES_PER_PAGE,
  sellFilters
} from './utils'
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
import { getData } from '../event/selectors'
import { getPage } from '../ui/browse/selectors'
import { fetchFavoritedItemsRequest } from '../favorites/actions'
import { buildBrowseURL } from './utils'

export function* routingSaga() {
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)
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

function* handleLocationChange(action: LocationChangeAction) {
  // Re-triggers fetchAssetsFromRoute action when the user goes back
  if (action.payload.action === 'POP') {
    const options: BrowseOptions = yield select(getCurrentBrowseOptions)
    yield put(fetchAssetsFromRouteAction(options))
  }
}

function* handleFetchAssetsFromRoute(action: FetchAssetsFromRouteAction) {
  const newOptions: BrowseOptions = yield call(
    getNewBrowseOptions,
    action.payload.options
  )
  yield call(fetchAssetsFromRoute, newOptions)
}

function* handleClearFilters() {
  const browseOptions: BrowseOptions = yield select(getCurrentBrowseOptions)
  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const clearedBrowseOptions = getClearedBrowseOptions(browseOptions)
  yield call(fetchAssetsFromRoute, clearedBrowseOptions)
  yield put(push(buildBrowseURL(pathname, clearedBrowseOptions)))
}

export function* handleBrowse(action: BrowseAction) {
  const options: BrowseOptions = yield call(
    getNewBrowseOptions,
    action.payload.options
  )

  const { pathname }: ReturnType<typeof getLocation> = yield select(getLocation)
  const eventsContracts: Record<string, string[]> = yield select(getData)
  const isAnEventRoute = Object.keys(eventsContracts).includes(
    pathname.slice(1)
  )
  yield call(fetchAssetsFromRoute, {
    ...options,
    ...(isAnEventRoute && {
      contracts:
        options.contracts && options.contracts.length > 0
          ? options.contracts
          : eventsContracts[pathname.slice(1)]
    })
  })
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
  const {
    search,
    onlyOnSale,
    onlyOnRent,
    onlySmart,
    isMap,
    contracts,
    tenant,
    minPrice,
    maxPrice,
    creators
  } = options

  const address =
    options.address || ((yield select(getCurrentLocationAddress)) as string)

  if (isMap) {
    yield put(setView(view))
  }

  const category = getCategoryFromSection(section)

  const currentPageInState: number = yield select(getPage)
  const offset = currentPageInState ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

  switch (section) {
    case Section.BIDS:
    case Section.STORE_SETTINGS:
      break
    case Section.ON_SALE:
      yield handleFetchOnSale(
        Array.isArray(address) ? address[0] : address,
        options.view!
      )
      break
    case Section.ON_RENT:
      yield handleFetchOnRent(
        options.view!,
        [RentalStatus.OPEN, RentalStatus.EXECUTED],
        View.ACCOUNT
          ? { tenant }
          : { ownerAddress: Array.isArray(address) ? address[0] : address }
      )
      break
    case Section.WEARABLES_TRENDING:
      yield put(fetchTrendingItemsRequest())
      break
    case Section.RECENTLY_SOLD:
      yield spawn(handleFetchSales, {
        ...(options.category && { categories: [options.category] })
      })
      break
    case Section.SALES:
      yield spawn(handleFetchSales, {
        address: Array.isArray(address) ? address[0] : address,
        page,
        pageSize: SALES_PER_PAGE
      })
      break
    case Section.COLLECTIONS:
      yield handleFetchCollections(
        page,
        Array.isArray(address) ? address[0] : address,
        sortBy,
        search
      )
      break
    case Section.LISTS:
      yield put(
        fetchFavoritedItemsRequest({
          view,
          section,
          page,
          filters: { first, skip }
        })
      )
      break
    default:
      if (isItems) {
        // TODO: clean up
        const isWearableHead =
          section === Sections[VendorName.DECENTRALAND].WEARABLES_HEAD
        const isWearableAccessory =
          section === Sections[VendorName.DECENTRALAND].WEARABLES_ACCESSORIES

        const wearableCategory = !isWearableAccessory
          ? getSearchWearableCategory(section)
          : undefined

        const emoteCategory =
          category === NFTCategory.EMOTE
            ? getSearchEmoteCategory(section)
            : undefined

        const { rarities, wearableGenders, emotePlayMode } = options

        yield put(
          fetchItemsRequest({
            view,
            page,
            filters: {
              first,
              skip,
              sortBy: getItemSortBy(sortBy),
              isOnSale: onlyOnSale,
              creator: address ? [address] : creators,
              wearableCategory,
              emoteCategory,
              isWearableHead,
              isWearableAccessory,
              isWearableSmart: onlySmart,
              search,
              category,
              rarities: rarities,
              contracts,
              wearableGenders,
              emotePlayMode,
              minPrice,
              maxPrice
            }
          })
        )
      } else {
        const [orderBy, orderDirection] = getAssetOrderBy(sortBy)

        yield put(
          fetchNFTsRequest({
            vendor,
            view,
            page,
            params: {
              first,
              skip,
              orderBy,
              orderDirection,
              onlyOnSale,
              onlyOnRent,
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
      onlyOnRent: previous.onlyOnRent,
      sortBy: previous.sortBy,
      isMap: previous.isMap,
      isFullscreen: previous.isFullscreen,
      viewAsGuest: previous.viewAsGuest
    }
  }

  const defaults = getDefaultOptionsByView(view, current.section as Section)

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
      filters: { creator: [address], isOnSale: true }
    })
  )

  yield put(
    fetchNFTsRequest({
      view,
      vendor: VendorName.DECENTRALAND,
      params: {
        first: MAX_QUERY_SIZE,
        skip: 0,
        onlyOnSale: true,
        address
      }
    })
  )
}

function* handleFetchOnRent(
  view: View,
  rentalStatus: RentalStatus[],
  options: { ownerAddress?: string; tenant?: string }
) {
  const { ownerAddress: address, tenant } = options

  yield put(
    fetchNFTsRequest({
      view,
      vendor: VendorName.DECENTRALAND,
      filters: {
        isLand: true,
        rentalStatus,
        tenant
      },
      params: {
        first: MAX_QUERY_SIZE,
        skip: 0,
        onlyOnRent: true,
        address
      }
    })
  )
}

function* handleFetchSales({
  address,
  categories,
  page = 1,
  pageSize = 5
}: {
  address?: string
  categories?: NFTCategory[]
  page?: number
  pageSize?: number
}) {
  yield put(
    fetchSalesRequest({
      first: pageSize,
      skip: (page - 1) * SALES_PER_PAGE,
      sortBy: SaleSortBy.RECENTLY_SOLD,
      ...(categories && { categories }),
      ...(address && { seller: address })
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
  let newOptions: BrowseOptions = {
    ...current,
    assetType: current.assetType || previous.assetType,
    section: current.section || previous.section
  }

  if (newOptions.section === Section.LISTS) return newOptions

  newOptions = {
    ...newOptions,
    onlyOnRent: current.hasOwnProperty('onlyOnRent')
      ? current.onlyOnRent
      : previous.onlyOnRent,
    onlyOnSale: current.hasOwnProperty('onlyOnSale')
      ? current.onlyOnSale
      : previous.onlyOnSale
  }

  // Checks if the sorting categories are correctly set for the onlyOnRental and the onlyOnSell filters
  const previousSortExistsAndIsNotARentalSort =
    previous.sortBy && !rentalFilters.includes(previous.sortBy)
  const previousSortExistsAndIsNotASellSort =
    previous.sortBy && !sellFilters.includes(previous.sortBy)
  const newSortExistsAndIsNotARentalSort =
    current.sortBy && !rentalFilters.includes(current.sortBy)
  const newSortExistsAndIsNotASellSort =
    current.sortBy && !sellFilters.includes(current.sortBy)

  const hasWrongRentalFilter =
    newOptions.onlyOnRent &&
    (newSortExistsAndIsNotARentalSort ||
      (!current.sortBy && previousSortExistsAndIsNotARentalSort))
  const hasWrongSellFilter =
    newOptions.onlyOnSale &&
    (newSortExistsAndIsNotASellSort ||
      (!current.sortBy && previousSortExistsAndIsNotASellSort))

  if (hasWrongRentalFilter || hasWrongSellFilter) {
    newOptions.sortBy = undefined
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
  return current.view || previous.view
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
