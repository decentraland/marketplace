import { matchPath } from 'react-router-dom'
import { push, getLocation, goBack, LOCATION_CHANGE, replace, LocationChangeAction } from 'connected-react-router'
import { takeEvery, put, select, call, take, delay, race, spawn } from 'redux-saga/effects'
import { CatalogFilters, CatalogSortBy, NFTCategory, RentalStatus, Sale, SaleSortBy, SaleType } from '@dcl/schemas'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { TRANSACTION_ACTION_FLAG } from 'decentraland-dapps/dist/modules/transaction/types'
import { DCLRegistrar } from '../../contracts/DCLRegistrar'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { isOfEnumType } from '../../utils/enums'
import { AssetStatusFilter } from '../../utils/filters'
import { AssetType } from '../asset/types'
import { ACCEPT_BID_SUCCESS, CANCEL_BID_SUCCESS, PLACE_BID_SUCCESS } from '../bid/actions'
import {
  CLAIM_NAME_CROSS_CHAIN_SUCCESS,
  CLAIM_NAME_SUCCESS,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  ClaimNameCrossChainSuccessAction,
  ClaimNameSuccessAction,
  ClaimNameTransactionSubmittedAction
} from '../ens/actions'
import { REGISTRAR_ADDRESS } from '../ens/sagas'
import { getData } from '../event/selectors'
import { fetchFavoritedItemsRequest } from '../favorites/actions'
import {
  BUY_ITEM_CROSS_CHAIN_SUCCESS,
  BUY_ITEM_SUCCESS,
  BuyItemCrossChainSuccessAction,
  BuyItemSuccessAction,
  fetchItemRequest,
  fetchItemsRequest,
  fetchTrendingItemsRequest
} from '../item/actions'
import { fetchNFTRequest, fetchNFTsRequest, TRANSFER_NFT_SUCCESS } from '../nft/actions'
import { CANCEL_ORDER_SUCCESS, CREATE_ORDER_SUCCESS, EXECUTE_ORDER_SUCCESS, ExecuteOrderSuccessAction } from '../order/actions'
import {
  getNetwork,
  getOnlySmart,
  getCurrentBrowseOptions,
  getCurrentLocationAddress,
  getSection,
  getMaxPrice,
  getMinPrice,
  getStatus,
  getEmotePlayMode,
  getLatestVisitedLocation,
  getRarities,
  getWearableGenders,
  getContracts,
  getSearch
} from '../routing/selectors'
import {
  FetchSalesFailureAction,
  fetchSalesRequest,
  FETCH_SALES_FAILURE,
  FETCH_SALES_SUCCESS,
  FetchSalesSuccessAction
} from '../sale/actions'
import { getSales } from '../sale/selectors'
import { setView } from '../ui/actions'
import { getPage } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { MAX_PAGE, PAGE_SIZE, getMaxQuerySize, MAX_QUERY_SIZE } from '../vendor/api'
import { Section } from '../vendor/decentraland'
import { VendorName } from '../vendor/types'
import { getFilters } from '../vendor/utils'
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
import { locations } from './locations'
import {
  getCategoryFromSection,
  getDefaultOptionsByView,
  getSearchWearableCategory,
  getSearchEmoteCategory,
  getItemSortBy,
  getAssetOrderBy,
  getCatalogSortBy
} from './search'
import { BrowseOptions } from './types'
import { getClearedBrowseOptions, isCatalogView, rentalFilters, SALES_PER_PAGE, sellFilters, buildBrowseURL } from './utils'

export function* routingSaga() {
  yield takeEvery(LOCATION_CHANGE, handleLocationChange)
  yield takeEvery(FETCH_ASSETS_FROM_ROUTE, handleFetchAssetsFromRoute)
  yield takeEvery(BROWSE, handleBrowse)
  yield takeEvery(CLEAR_FILTERS, handleClearFilters)
  yield takeEvery(GO_BACK, handleGoBack)
  yield takeEvery(
    [CREATE_ORDER_SUCCESS, CANCEL_ORDER_SUCCESS, PLACE_BID_SUCCESS, ACCEPT_BID_SUCCESS, CANCEL_BID_SUCCESS, TRANSFER_NFT_SUCCESS],
    handleRedirectToActivity
  )

  yield takeEvery(
    [EXECUTE_ORDER_SUCCESS, BUY_ITEM_SUCCESS, BUY_ITEM_CROSS_CHAIN_SUCCESS, CLAIM_NAME_SUCCESS, CLAIM_NAME_CROSS_CHAIN_SUCCESS],
    handleRedirectToSuccessPage
  )
  yield takeEvery(CLAIM_NAME_TRANSACTION_SUBMITTED, handleRedirectClaimingNameToSuccessPage)
}

function* handleLocationChange(action: LocationChangeAction) {
  // Re-triggers fetchAssetsFromRoute action when the user goes back
  if (action.payload.action === 'POP' && matchPath(action.payload.location.pathname, { path: locations.browse() })) {
    const latestVisitedLocation = (yield select(getLatestVisitedLocation)) as ReturnType<typeof getLocation>
    const isComingFromBrowse = !!matchPath(latestVisitedLocation?.pathname, {
      path: locations.browse()
    })
    if (isComingFromBrowse) {
      const options = (yield select(getCurrentBrowseOptions)) as ReturnType<typeof getCurrentBrowseOptions>
      yield put(fetchAssetsFromRouteAction(options))
    }
  }
}

function* handleFetchAssetsFromRoute(action: FetchAssetsFromRouteAction) {
  const newOptions = (yield call(getNewBrowseOptions, action.payload.options)) as BrowseOptions
  yield call(fetchAssetsFromRoute, newOptions)
}

function* handleClearFilters() {
  const browseOptions = (yield select(getCurrentBrowseOptions)) as ReturnType<typeof getCurrentBrowseOptions>
  const { pathname } = (yield select(getLocation)) as ReturnType<typeof getLocation>
  const clearedBrowseOptions = getClearedBrowseOptions(browseOptions)
  yield call(fetchAssetsFromRoute, clearedBrowseOptions)
  yield put(push(buildBrowseURL(pathname, clearedBrowseOptions)))
}

export function* handleBrowse(action: BrowseAction) {
  const options = (yield call(getNewBrowseOptions, action.payload.options)) as BrowseOptions

  const { pathname } = (yield select(getLocation)) as ReturnType<typeof getLocation>
  const eventsContracts = (yield select(getData)) as Record<string, string[]>
  const isAnEventRoute = Object.keys(eventsContracts).includes(pathname.slice(1))
  yield call(fetchAssetsFromRoute, {
    ...options,
    ...(isAnEventRoute && {
      contracts: options.contracts && options.contracts.length > 0 ? options.contracts : eventsContracts[pathname.slice(1)]
    })
  })
  yield put(push(buildBrowseURL(pathname, options)))
}

function* handleGoBack(action: GoBackAction) {
  const { defaultLocation } = action.payload

  yield put(goBack())

  const { timeout }: { timeout?: boolean } = (yield race({
    changed: take(LOCATION_CHANGE),
    timeout: delay(250)
  })) as { changed: LocationChangeAction; timeout: boolean }

  if (timeout) {
    yield put(replace(defaultLocation || locations.root()))
  }
}

export function* fetchAssetsFromRoute(options: BrowseOptions) {
  const isItems = options.assetType === AssetType.ITEM
  const view = options.view!
  const vendor = options.vendor!
  const page = options.page!
  const section = options.section && isOfEnumType(options.section, Section) ? options.section : undefined
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
    creators,
    network,
    status,
    emoteHasGeometry,
    emoteHasSound
  } = options

  const address: string | string[] = options.address || ((yield select(getCurrentLocationAddress)) as string)

  if (isMap) {
    yield put(setView(view))
  }

  const category = section ? getCategoryFromSection(section) : undefined

  const currentPageInState: number | undefined = (yield select(getPage)) as ReturnType<typeof getPage>
  const offset = currentPageInState && currentPageInState < page ? page - 1 : 0
  const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
  const first = Math.min(page * PAGE_SIZE - skip, getMaxQuerySize(vendor))

  switch (section) {
    case Section.BIDS:
    case Section.STORE_SETTINGS:
      break
    case Section.ON_SALE:
      yield handleFetchOnSale(Array.isArray(address) ? (address[0] as string) : address, options.view!)
      break
    case Section.ON_RENT:
      yield handleFetchOnRent(
        options.view!,
        [RentalStatus.OPEN, RentalStatus.EXECUTED],
        View.ACCOUNT ? { tenant } : { ownerAddress: Array.isArray(address) ? (address[0] as string) : address }
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
        address: Array.isArray(address) ? (address[0] as string) : address,
        page,
        pageSize: SALES_PER_PAGE
      })
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
    default: {
      const isWearableHead = section === Section.WEARABLES_HEAD
      const isWearableAccessory = section === Section.WEARABLES_ACCESSORIES

      const wearableCategory = !isWearableAccessory && section ? getSearchWearableCategory(section) : undefined

      const emoteCategory = category === NFTCategory.EMOTE && section ? getSearchEmoteCategory(section) : undefined

      const { rarities, wearableGenders, emotePlayMode } = options

      const statusParameters: Partial<Omit<CatalogFilters, 'sortBy'>> = {
        ...(status === AssetStatusFilter.ON_SALE ? { isOnSale: true } : {}),
        ...(status === AssetStatusFilter.NOT_FOR_SALE ? { isOnSale: false } : {}),
        ...(status === AssetStatusFilter.ONLY_LISTING ? { onlyListing: true } : {}),
        ...(status === AssetStatusFilter.ONLY_MINTING ? { onlyMinting: true } : {})
      }
      if (isItems) {
        yield put(
          fetchItemsRequest({
            view,
            page,
            filters: {
              first,
              skip,
              sortBy: isCatalogView(view)
                ? view === View.HOME_NEW_ITEMS
                  ? CatalogSortBy.NEWEST
                  : getCatalogSortBy(sortBy)
                : getItemSortBy(sortBy),
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
              contractAddresses: contracts,
              wearableGenders,
              emotePlayMode,
              minPrice,
              maxPrice,
              network,
              emoteHasGeometry,
              emoteHasSound,
              ...statusParameters
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
}

export function* getNewBrowseOptions(current: BrowseOptions): Generator<unknown, BrowseOptions, any> {
  let previous = (yield select(getCurrentBrowseOptions)) as ReturnType<typeof getCurrentBrowseOptions>
  current = (yield deriveCurrentOptions(previous, current)) as BrowseOptions
  const view = deriveView(previous, current)
  const section: Section = current.section ? (current.section as Section) : ((yield select(getSection)) as ReturnType<typeof getSection>)
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

  const defaults = getDefaultOptionsByView(view, section)
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

  yield call(handleFetchNFTsOnSale, address, view)
}

function* handleFetchNFTsOnSale(address: string, view: View) {
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

function* handleFetchOnRent(view: View, rentalStatus: RentalStatus[], options: { ownerAddress?: string; tenant?: string }) {
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

  const result = (yield race({
    success: take(FETCH_SALES_SUCCESS),
    failure: take(FETCH_SALES_FAILURE)
  })) as {
    success: FetchSalesSuccessAction
    failure: FetchSalesFailureAction
  }

  if (result.failure) {
    return
  }

  const sales = (yield select(getSales)) as ReturnType<typeof getSales>

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

// TODO: Consider moving this should live to each vendor
function* deriveCurrentOptions(previous: BrowseOptions, current: BrowseOptions) {
  let newOptions: BrowseOptions = {
    ...current,
    assetType: current.assetType || previous.assetType,
    section: current.section || previous.section
  }

  if (newOptions.section === Section.LISTS) return newOptions

  newOptions = {
    ...newOptions,
    onlyOnRent: Object.prototype.hasOwnProperty.call(current, 'onlyOnRent') ? current.onlyOnRent : previous.onlyOnRent,
    onlyOnSale:
      current.assetType === AssetType.ITEM
        ? undefined
        : Object.prototype.hasOwnProperty.call(current, 'onlyOnSale')
          ? current.onlyOnSale
          : previous.onlyOnSale
  }

  // Checks if the sorting categories are correctly set for the onlyOnRental and the onlyOnSell filters
  const previousSortExistsAndIsNotARentalSort = previous.sortBy && !rentalFilters.includes(previous.sortBy)
  const previousSortExistsAndIsNotASellSort = previous.sortBy && !sellFilters.includes(previous.sortBy)
  const newSortExistsAndIsNotARentalSort = current.sortBy && !rentalFilters.includes(current.sortBy)
  const newSortExistsAndIsNotASellSort = current.sortBy && !sellFilters.includes(current.sortBy)

  const hasWrongRentalFilter =
    newOptions.onlyOnRent && (newSortExistsAndIsNotARentalSort || (!current.sortBy && previousSortExistsAndIsNotARentalSort))
  const hasWrongSellFilter =
    newOptions.onlyOnSale && (newSortExistsAndIsNotASellSort || (!current.sortBy && previousSortExistsAndIsNotASellSort))

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
          rarities: (yield select(getRarities)) as ReturnType<typeof getRarities>,
          wearableGenders: (yield select(getWearableGenders)) as ReturnType<typeof getWearableGenders>,
          search: (yield select(getSearch)) as ReturnType<typeof getSearch>,
          network: (yield select(getNetwork)) as ReturnType<typeof getNetwork>,
          contracts: (yield select(getContracts)) as ReturnType<typeof getContracts>,
          onlySmart: (yield select(getOnlySmart)) as ReturnType<typeof getOnlySmart>,
          maxPrice: (yield select(getMaxPrice)) as ReturnType<typeof getMaxPrice>,
          minPrice: (yield select(getMinPrice)) as ReturnType<typeof getMinPrice>,
          status: (yield select(getStatus)) as ReturnType<typeof getStatus>,
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
          rarities: (yield select(getRarities)) as ReturnType<typeof getRarities>,
          maxPrice: (yield select(getMaxPrice)) as ReturnType<typeof getMaxPrice>,
          minPrice: (yield select(getMinPrice)) as ReturnType<typeof getMinPrice>,
          status: (yield select(getStatus)) as ReturnType<typeof getStatus>,
          emotePlayMode: (yield select(getEmotePlayMode)) as ReturnType<typeof getEmotePlayMode>,
          ...newOptions
        }
      }
      break
    }
    case NFTCategory.ENS: {
      // for ENS, if the previous page had `onlyOnSale` as `undefined` like wearables or emotes, it defaults to `true`, otherwise use the current value
      newOptions = {
        ...newOptions,
        assetType: AssetType.NFT
      }

      // Only if the user is not in their own page, show ens on sale by default.
      if (window.location.pathname !== locations.currentAccount()) {
        newOptions.onlyOnSale = previous.onlyOnSale === undefined ? true : current.onlyOnSale
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
  const location = (yield select(getLocation)) as ReturnType<typeof getLocation>
  const redirectTo = new URLSearchParams(location.search).get('redirectTo')
  if (redirectTo) {
    yield put(push(decodeURIComponent(redirectTo)))
  } else {
    yield put(push(locations.activity()))
  }
}

function* handleRedirectClaimingNameToSuccessPage(action: ClaimNameTransactionSubmittedAction) {
  const data = action.payload[TRANSACTION_ACTION_FLAG] as { hash: string; payload: { subdomain: string } }
  const signer = (yield call(getSigner)) as Awaited<ReturnType<typeof getSigner>>
  const dclRegistrarContract: DCLRegistrar = (yield call([DCLRegistrar__factory, 'connect'], REGISTRAR_ADDRESS, signer)) as Awaited<
    ReturnType<typeof DCLRegistrar__factory.connect>
  >
  const contractAddress = dclRegistrarContract.address
  yield put(
    push(
      locations.success({
        txHash: data.hash,
        assetType: AssetType.NFT,
        tokenId: '',
        contractAddress,
        subdomain: data.payload.subdomain
      })
    )
  )
}

function* handleRedirectToSuccessPage(
  action:
    | ExecuteOrderSuccessAction
    | BuyItemSuccessAction
    | BuyItemCrossChainSuccessAction
    | ClaimNameSuccessAction
    | ClaimNameCrossChainSuccessAction
) {
  const payload = action.payload
  const isCrossChainAction = 'route' in payload && payload.route.route.params.fromChain !== payload.route.route.params.toChain // it's cross chain only if the fromChain is different from the toChain
  const successParams = {
    txHash: payload.txHash,
    tokenId:
      'order' in payload && payload.order?.tokenId
        ? payload.order.tokenId
        : 'item' in payload
          ? payload.item.itemId
          : 'nft' in payload
            ? payload.nft.tokenId
            : 'ens' in payload
              ? payload.ens.tokenId
              : '',
    assetType: isCrossChainAction
      ? 'order' in payload && !!payload.order // if cross chain check for the order object
        ? AssetType.NFT
        : AssetType.ITEM
      : 'item' in payload // for the rest of the action, check for the item object
        ? AssetType.ITEM
        : AssetType.NFT,
    contractAddress:
      'item' in payload
        ? payload.item.contractAddress
        : 'nft' in payload
          ? payload.nft.contractAddress
          : 'ens' in payload
            ? payload.ens.contractAddress
            : ''
  }
  yield put(push(locations.success(successParams)))
}
