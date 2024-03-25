import { AnyAction } from 'redux'
import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'
import { Item } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { AuthorizationStepStatus } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { locations } from '../routing/locations'
import { RootState } from '../reducer'
import {
  BUY_ITEM_REQUEST,
  FETCH_COLLECTION_ITEMS_REQUEST,
  FETCH_ITEM_REQUEST,
  FetchCollectionItemsRequestAction,
  FetchItemRequestAction
} from './actions'

const isFetchItemRequest = (action: AnyAction): action is FetchItemRequestAction => action.type === FETCH_ITEM_REQUEST
const isFetchCollectionItemsRequest = (action: AnyAction): action is FetchCollectionItemsRequestAction =>
  action.type === FETCH_COLLECTION_ITEMS_REQUEST

export const getState = (state: RootState) => state.item
export const getData = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getMintItemStatus = (state: RootState) => {
  if (isLoadingType(getLoading(state), BUY_ITEM_REQUEST)) {
    return AuthorizationStepStatus.WAITING
  }

  if (getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  return AuthorizationStepStatus.PENDING
}

export const isFetchingItem = (state: RootState, contractAddress: string, tokenId: string) =>
  getLoading(state).find(
    action => isFetchItemRequest(action) && action.payload.contractAddress === contractAddress && action.payload.tokenId === tokenId
  ) !== undefined

export const isFetchingItemsOfCollection = (state: RootState, contractAddress: string) =>
  getLoading(state).find(action => isFetchCollectionItemsRequest(action) && action.payload.contractAddresses?.includes(contractAddress)) !==
  undefined

export const getItems = createSelector<RootState, ReturnType<typeof getData>, Item[]>(getData, itemsById => Object.values(itemsById))

const ItemDetailMatchSelector = createMatchSelector<
  RootState,
  {
    contractAddress: string
    tokenId: string
  }
>(locations.item(':contractAddress', ':tokenId'))

export const getContractAddress = createSelector<RootState, ReturnType<typeof ItemDetailMatchSelector>, string | null>(
  ItemDetailMatchSelector,
  match => match?.params.contractAddress.toLowerCase() || null
)

export const getTokenId = createSelector<RootState, ReturnType<typeof ItemDetailMatchSelector>, string | null>(
  ItemDetailMatchSelector,
  match => match?.params.tokenId || null
)

export const getItemsByContractAddress = createSelector(getItems, items =>
  items.reduce(
    (acc, item) => {
      const { contractAddress } = item
      if (!acc[contractAddress]) acc[contractAddress] = []
      acc[contractAddress].push(item)
      return acc
    },
    {} as Record<string, Item[]>
  )
)
