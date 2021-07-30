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
import { buyItemRequest, buyItemFailure, buyItemSuccess } from './actions'
import { itemSaga } from './sagas'
import { TxSend } from 'web3x-es/contract'

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
    it('should send a meta transaction to the collection store contract living in the chain provided by the item', () => {
      const buyTransactionParameters = [
        {
          collection: Address.fromString(item.contractAddress),
          ids: [item.itemId],
          prices: [item.price],
          beneficiaries: [Address.fromString(wallet.address)]
        }
      ]

      const txBuy = {} as TxSend

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
