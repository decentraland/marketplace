import { expectSaga } from 'redux-saga-test-plan'
import { Address } from 'web3x-es/address'
import { getWallet } from '../wallet/selectors'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId, Item } from '@dcl/schemas'
import { call, select } from 'redux-saga/effects'
import { ContractName, getContract } from 'decentraland-transactions'
import { CollectionStore } from '../../contracts/CollectionStore'
import { ContractFactory } from '../contract/ContractFactory'
import { sendTransaction } from '../wallet/utils'
import {
  buyItemRequest,
  buyItemFailure,
  buyItemSuccess,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchItemSuccess,
  fetchItemRequest,
  fetchItemFailure
} from './actions'
import { itemSaga } from './sagas'
import { TxSend } from 'web3x-es/contract'
import { View } from '../ui/types'
import { itemAPI } from '../vendor/decentraland/item/api'

const item = {
  itemId: 'anItemId',
  price: '324234',
  chainId: ChainId.MATIC_MAINNET,
  contractAddress: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
} as Item

const wallet = {
  address: '0x32be343b94f860124dc4fee278fdcbd38c102d88'
}

const collectionStoreContractConfig = getContract(
  ContractName.CollectionStore,
  item.chainId
)
const collectionStoreContract = new CollectionStore(
  jest.fn() as any,
  Address.fromString(collectionStoreContractConfig.address)
)

const txHash =
  '0x9fc518261399c1bd236997706347f8b117a061cef5518073b1c3eefd5efbff84'

const anError = new Error('An error occured')

const itemBrowseOptions = {
  view: View.MARKET,
  page: 0,
  filters: {}
}

describe('when handling the buy items request action', () => {
  describe("when there's no wallet loaded in the state", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([[select(getWallet), null]])
        .put(buyItemFailure('A defined wallet is required to buy an item'))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe("when there's an error while building the store contract", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([
          [select(getWallet), wallet],
          [matchers.call.fn(ContractFactory.build), Promise.reject(anError)]
        ])
        .put(buyItemFailure(anError.message))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when sending the meta transaction fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga)
        .provide([
          [select(getWallet), wallet],
          [
            matchers.call.fn(ContractFactory.build),
            Promise.resolve(collectionStoreContract)
          ],
          [matchers.call.fn(sendTransaction), Promise.reject(anError)]
        ])
        .put(buyItemFailure(anError.message))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the meta transaction is sent succesfully', () => {
    const buyTransactionParameters = [
      {
        collection: Address.fromString(item.contractAddress),
        ids: [item.itemId],
        prices: [item.price],
        beneficiaries: [Address.fromString(wallet.address)]
      }
    ]

    const txBuy = {} as TxSend

    it('should send a meta transaction to the collection store contract living in the chain provided by the item and dispatch the success action', () => {
      return expectSaga(itemSaga)
        .provide([
          [select(getWallet), wallet],
          [
            matchers.call.fn(ContractFactory.build),
            Promise.resolve(collectionStoreContract)
          ],
          [
            call(collectionStoreContract.methods.buy, buyTransactionParameters),
            txBuy
          ],
          [
            call(
              sendTransaction,
              txBuy,
              collectionStoreContractConfig,
              Address.fromString(wallet.address)
            ),
            Promise.resolve(txHash)
          ]
        ])
        .put(buyItemSuccess(item.chainId, txHash, item))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the fetch items request action', () => {
  describe('when the request is successful', () => {
    let dateNowSpy: jest.SpyInstance
    const nowTimestamp = 1487076708000
    const fetchResult = { data: [item], total: 1 }

    beforeEach(() => {
      dateNowSpy = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => nowTimestamp)
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
    })

    it('should dispatch a successful action with the fetched items', () => {
      return expectSaga(itemSaga)
        .provide([
          [call([itemAPI, 'fetch'], itemBrowseOptions.filters), fetchResult]
        ])
        .put(
          fetchItemsSuccess(
            fetchResult.data,
            fetchResult.total,
            itemBrowseOptions,
            nowTimestamp
          )
        )
        .dispatch(fetchItemsRequest(itemBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the request fails', () => {
    it('should dispatching a failing action with the error and the options', () => {
      return expectSaga(itemSaga)
        .provide([
          [
            call([itemAPI, 'fetch'], itemBrowseOptions.filters),
            Promise.reject(anError)
          ]
        ])
        .put(fetchItemsFailure(anError.message, itemBrowseOptions))
        .dispatch(fetchItemsRequest(itemBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('when handling the fetch item request action', () => {
    describe('when the request is successful', () => {
      it('should dispatch a successful action with the fetched items', () => {
        return expectSaga(itemSaga)
          .provide([
            [
              call([itemAPI, 'fetchOne'], item.contractAddress, item.itemId),
              item
            ]
          ])
          .put(fetchItemSuccess(item))
          .dispatch(fetchItemRequest(item.contractAddress, item.itemId))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the request fails', () => {
      it('should dispatching a failing action with the contract address, the token id and the error message', () => {
        return expectSaga(itemSaga)
          .provide([
            [
              call([itemAPI, 'fetchOne'], item.contractAddress, item.itemId),
              Promise.reject(anError)
            ]
          ])
          .put(
            fetchItemFailure(item.contractAddress, item.itemId, anError.message)
          )
          .dispatch(fetchItemRequest(item.contractAddress, item.itemId))
          .run({ silenceTimeout: true })
      })
    })
  })
})
