import { ChainId, Item, Network } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { formatWeiMANA } from '../../lib/mana'
import { getAssetName } from '../asset/utils'
import { View } from '../ui/types'
import {
  buyItemFailure,
  buyItemRequest,
  buyItemSuccess,
  BUY_ITEM_FAILURE,
  BUY_ITEM_REQUEST,
  BUY_ITEM_SUCCESS,
  fetchItemsFailure,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchTrendingItemsRequest,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_TRENDING_ITEMS_REQUEST
} from './actions'

const itemBrowseOptions = {
  view: View.MARKET,
  page: 0
}

const item = {
  name: 'aName',
  contractAddress: 'anAddress',
  itemId: 'anItemId',
  price: '1500000000000000000000',
  network: Network.ETHEREUM
} as Item

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the items request', () => {
  it('should return an object representing the action', () => {
    expect(fetchItemsRequest(itemBrowseOptions)).toEqual({
      type: FETCH_ITEMS_REQUEST,
      meta: undefined,
      payload: itemBrowseOptions
    })
  })
})

describe('when creating the action to signal a success in the items request', () => {
  const items = [{} as Item]
  const total = 1
  const timestamp = 1627595757

  it('should return an object representing the action', () => {
    expect(
      fetchItemsSuccess(items, total, itemBrowseOptions, timestamp)
    ).toEqual({
      type: FETCH_ITEMS_SUCCESS,
      meta: undefined,
      payload: { items, total, options: itemBrowseOptions, timestamp }
    })
  })
})

describe('when creating the action to signal a failure items request', () => {
  it('should return an object representing the action', () => {
    expect(fetchItemsFailure(anErrorMessage, itemBrowseOptions)).toEqual({
      type: FETCH_ITEMS_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage, options: itemBrowseOptions }
    })
  })
})

describe('when creating the action to signal the start of the buy item request', () => {
  it('should return an object representing the action', () => {
    expect(buyItemRequest(item)).toEqual({
      type: BUY_ITEM_REQUEST,
      meta: undefined,
      payload: { item }
    })
  })
})

describe('when creating the action to signal a successful item request', () => {
  const chainId = ChainId.MATIC_MAINNET
  const txHash = 'aTxHash'

  it('should return an object representing the action', () => {
    expect(buyItemSuccess(chainId, txHash, item)).toEqual({
      type: BUY_ITEM_SUCCESS,
      meta: undefined,
      payload: {
        item,
        ...buildTransactionPayload(chainId, txHash, {
          itemId: item.itemId,
          contractAddress: item.contractAddress,
          network: item.network,
          name: getAssetName(item),
          price: formatWeiMANA(item.price)
        })
      }
    })
  })
})

describe('when creating the action to signal a failure in the buy item request', () => {
  it('should return an object representing the action', () => {
    expect(buyItemFailure(anErrorMessage)).toEqual({
      type: BUY_ITEM_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage }
    })
  })
})

describe('when creating the action to fetch the trending items request', () => {
  let size: number
  beforeEach(() => {
    size = 20
  })
  it('should return an object representing the action', () => {
    expect(fetchTrendingItemsRequest(size)).toEqual({
      type: FETCH_TRENDING_ITEMS_REQUEST,
      meta: undefined,
      payload: { size }
    })
  })
})
