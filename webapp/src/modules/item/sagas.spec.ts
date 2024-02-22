import { getLocation } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { call, select, take } from 'redux-saga/effects'
import { ChainId, Item, Network, Rarity } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { sendTransaction } from 'decentraland-dapps/dist/modules/wallet/utils'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import {
  ManaPurchase,
  NFTPurchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import {
  closeModal,
  openModal
} from 'decentraland-dapps/dist/modules/modal/actions'
import { NetworkGatewayType } from 'decentraland-ui'
import { locations } from '../routing/locations'
import { fetchSmartWearableRequiredPermissionsRequest } from '../asset/actions'
import { getWallet } from '../wallet/selectors'
import { View } from '../ui/types'
import { ItemAPI } from '../vendor/decentraland/item/api'
import { CatalogAPI } from '../vendor/decentraland/catalog/api'
import {
  buyAssetWithCard,
  BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
} from '../asset/utils'
import { waitForWalletConnectionAndIdentityIfConnecting } from '../wallet/utils'
import {
  buyItemRequest,
  buyItemFailure,
  buyItemSuccess,
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchItemSuccess,
  fetchItemRequest,
  fetchItemFailure,
  fetchTrendingItemsSuccess,
  fetchTrendingItemsFailure,
  fetchTrendingItemsRequest,
  buyItemWithCardRequest,
  buyItemWithCardFailure,
  buyItemWithCardSuccess,
  FETCH_ITEM_FAILURE,
  fetchCollectionItemsRequest,
  fetchCollectionItemsSuccess,
  fetchCollectionItemsFailure,
  FETCH_ITEMS_CANCELLED_ERROR_MESSAGE
} from './actions'
import { CANCEL_FETCH_ITEMS, itemSaga } from './sagas'
import { getData as getItems } from './selectors'
import { getItem } from './utils'
import { ItemBrowseOptions } from './types'
import { getIsMarketplaceServerEnabled } from '../features/selectors'
import { waitForFeatureFlagsToBeLoaded } from '../features/utils'

const item = {
  itemId: 'anItemId',
  price: '324234',
  chainId: ChainId.MATIC_MAINNET,
  contractAddress: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
} as Item

const wallet = {
  address: '0x32be343b94f860124dc4fee278fdcbd38c102d88',
  chainId: ChainId.MATIC_MAINNET
}

const txHash =
  '0x9fc518261399c1bd236997706347f8b117a061cef5518073b1c3eefd5efbff84'

const anError = new Error('An error occured')

const itemBrowseOptions: ItemBrowseOptions = {
  view: View.MARKET,
  page: 0,
  filters: {}
}

const manaPurchase: ManaPurchase = {
  address: 'anAddress',
  id: 'anId',
  network: Network.ETHEREUM,
  timestamp: 1671028355396,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash,
  paymentMethod: 'paymentMethod',
  amount: 10
}

const nftPurchase: NFTPurchase = {
  ...manaPurchase,
  nft: {
    contractAddress: 'contractAddress',
    itemId: 'anId',
    tokenId: undefined,
    tradeType: TradeType.PRIMARY,
    cryptoAmount: 10
  }
}

const getIdentity = () => undefined

describe('when handling the buy items request action', () => {
  describe("when there's no wallet loaded in the state", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([[select(getWallet), null]])
        .put(buyItemFailure('A defined wallet is required to buy an item'))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when sending the meta transaction fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [select(getWallet), wallet],
          [matchers.call.fn(sendTransaction), Promise.reject(anError)]
        ])
        .put(buyItemFailure(anError.message))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the meta transaction is sent succesfully', () => {
    it('should send a meta transaction to the collection store contract living in the chain provided by the item and dispatch the success action', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [select(getWallet), wallet],
          [matchers.call.fn(sendTransaction), Promise.resolve(txHash)]
        ])
        .put(buyItemSuccess(wallet.chainId, txHash, item))
        .dispatch(buyItemRequest(item))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the buy items with card action', () => {
  beforeEach(() => {
    jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the explanation modal has already been shown', () => {
    it('should open Transak widget', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            null
          ]
        ])
        .put(openModal('BuyWithCardExplanationModal', { asset: item }))
        .dispatch(buyItemWithCardRequest(item))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when the explanation modal is shown and the user closes it', () => {
    it('should not set the item in the local storage to show the modal again later', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [
            call(
              [localStorage, 'getItem'],
              BUY_NFTS_WITH_CARD_EXPLANATION_POPUP_KEY
            ),
            null
          ]
        ])
        .put(openModal('BuyWithCardExplanationModal', { asset: item }))
        .dispatch(buyItemWithCardRequest(item))
        .dispatch(closeModal('BuyWithCardExplanationModal'))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(localStorage.setItem).not.toHaveBeenCalled()
        })
    })
  })

  describe('when opening Transak Widget fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([[call(buyAssetWithCard, item), Promise.reject(anError)]])
        .put(buyItemWithCardFailure(anError.message))
        .dispatch(buyItemWithCardRequest(item))
        .run({ silenceTimeout: true })
    })
  })

  describe('when Transak widget is opened succesfully', () => {
    it('should dispatch the success action', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([[call(buyAssetWithCard, item), Promise.resolve()]])
        .dispatch(buyItemWithCardRequest(item))
        .run({ silenceTimeout: true })
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
        })
    })
  })
})

describe('when handling the set purchase action', () => {
  describe('when it is a MANA purchase', () => {
    it('should not put any new action', () => {
      return expectSaga(itemSaga, getIdentity)
        .dispatch(setPurchase(manaPurchase))
        .run({ silenceTimeout: true })
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
        })
    })
  })

  describe('when it is an NFT purchase', () => {
    describe('when it is a secondary market purchase', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga, getIdentity)
          .dispatch(
            setPurchase({
              ...nftPurchase,
              nft: {
                ...nftPurchase.nft,
                tokenId: nftPurchase.nft.itemId,
                tradeType: TradeType.SECONDARY,
                itemId: undefined
              }
            })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when the purchase is incomplete', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga, getIdentity)
          .dispatch(setPurchase(nftPurchase))
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is complete without a txHash', () => {
      it('should not put any new action', () => {
        return expectSaga(itemSaga, getIdentity)
          .dispatch(
            setPurchase({
              ...nftPurchase,
              txHash: null,
              status: PurchaseStatus.COMPLETE
            })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when it is complete and it has a txHash', () => {
      const { contractAddress, itemId } = nftPurchase.nft

      describe('when the item does not yet exist in the store', () => {
        it('should put the action signaling the fetch item request', () => {
          return expectSaga(itemSaga, getIdentity)
            .provide([
              [select(getItems), {}],
              [
                matchers.put(fetchItemRequest(contractAddress, itemId!)),
                undefined
              ]
            ])
            .put(fetchItemRequest(contractAddress, itemId!))
            .dispatch(
              setPurchase({
                ...nftPurchase,
                txHash,
                status: PurchaseStatus.COMPLETE
              })
            )
            .run({ silenceTimeout: true })
            .then(({ effects }) => {
              expect(effects.put).toBeUndefined()
            })
        })
      })

      describe('when the action of fetching the item has been dispatched', () => {
        describe('when the fetch item request fails', () => {
          it('should put an action signaling the failure of the buy item with card request', () => {
            return expectSaga(itemSaga, getIdentity)
              .provide([
                [select(getItems), {}],
                [
                  matchers.put(fetchItemRequest(contractAddress, itemId!)),
                  undefined
                ],
                [
                  take(FETCH_ITEM_FAILURE),
                  { payload: { error: anError.message } }
                ]
              ])
              .put(fetchItemRequest(contractAddress, itemId!))
              .put(buyItemWithCardFailure(anError.message))
              .dispatch(
                setPurchase({
                  ...nftPurchase,
                  txHash,
                  status: PurchaseStatus.COMPLETE
                })
              )
              .run({ silenceTimeout: true })
          })
        })
      })

      describe('when the item already exists in the store', () => {
        const items = { anItemId: item }

        it('should put an action signaling the success of the buy item with card request', () => {
          return expectSaga(itemSaga, getIdentity)
            .provide([
              [select(getItems), items],
              [call(getItem, contractAddress, itemId!, items), item]
            ])
            .put(
              buyItemWithCardSuccess(item.chainId, txHash, item, {
                ...nftPurchase,
                status: PurchaseStatus.COMPLETE
              })
            )
            .dispatch(
              setPurchase({
                ...nftPurchase,
                txHash,
                status: PurchaseStatus.COMPLETE
              })
            )
            .run({ silenceTimeout: true })
        })
      })
    })
  })
})

describe('when handling the fetch collections items request action', () => {
  describe('when the request is successful', () => {
    const fetchResult = { data: [item] }

    it('should dispatch a successful action with the fetched items', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([[matchers.call.fn(ItemAPI.prototype.get), fetchResult]])
        .call.like({
          fn: ItemAPI.prototype.get,
          args: [{ first: 10, contractAddresses: [] }]
        })
        .put(fetchCollectionItemsSuccess(fetchResult.data))
        .dispatch(
          fetchCollectionItemsRequest({ contractAddresses: [], first: 10 })
        )
        .run({ silenceTimeout: true })
    })
  })

  describe('when the request fails', () => {
    it('should dispatch a failing action with the error and the options', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [matchers.call.fn(ItemAPI.prototype.get), Promise.reject(anError)]
        ])
        .put(fetchCollectionItemsFailure(anError.message))
        .dispatch(
          fetchCollectionItemsRequest({ contractAddresses: [], first: 10 })
        )
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the fetch items request action', () => {
  describe('when the request is successful', () => {
    let pathname: string
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

    describe('and its dispatched from the browse path', () => {
      beforeEach(() => {
        pathname = locations.browse()
      })
      describe('and there is an ongoing fetch item request', () => {
        let wallet: Wallet | undefined
        let originalBrowseOptions = itemBrowseOptions
        let newBrowseOptions: ItemBrowseOptions = {
          ...itemBrowseOptions,
          filters: { ...itemBrowseOptions.filters, rarities: [Rarity.COMMON] }
        }
        describe('and there is a wallet connected', () => {
          beforeEach(() => {
            wallet = {} as Wallet
          })

          it('should dispatch a successful action with the fetched items and cancel the ongoing one', () => {
            return expectSaga(itemSaga, getIdentity)
              .provide([
                [
                  matchers.call.fn(
                    waitForWalletConnectionAndIdentityIfConnecting
                  ),
                  undefined
                ],
                [matchers.call.fn(waitForFeatureFlagsToBeLoaded), undefined],
                [select(getWallet), wallet],
                [select(getIsMarketplaceServerEnabled), true],
                [select(getLocation), { pathname }],
                {
                  call(effect, next) {
                    if (
                      effect.fn === CatalogAPI.prototype.get &&
                      effect.args[0] === originalBrowseOptions.filters
                    ) {
                      // Add a setTimeout so it gives time to get it cancelled
                      return new Promise(() => {})
                    }
                    if (
                      effect.fn === CatalogAPI.prototype.get &&
                      effect.args[0] === newBrowseOptions.filters
                    ) {
                      // Mock without timeout
                      return fetchResult
                    }
                    return next()
                  }
                }
              ])
              .call.like({
                fn: CatalogAPI.prototype.get,
                args: [newBrowseOptions.filters]
              })
              .put(
                fetchItemsFailure(
                  FETCH_ITEMS_CANCELLED_ERROR_MESSAGE,
                  originalBrowseOptions
                )
              )
              .put(
                fetchItemsSuccess(
                  fetchResult.data,
                  fetchResult.total,
                  newBrowseOptions,
                  nowTimestamp
                )
              )
              .dispatch(fetchItemsRequest(originalBrowseOptions))
              .dispatch({ type: CANCEL_FETCH_ITEMS })
              .dispatch(fetchItemsRequest(newBrowseOptions))
              .run({ silenceTimeout: true })
          })
        })

        describe('and there is no wallet connected', () => {
          it('should dispatch a successful action with the fetched items and cancel the ongoing one', () => {
            return expectSaga(itemSaga, getIdentity)
              .provide([
                [
                  matchers.call.fn(
                    waitForWalletConnectionAndIdentityIfConnecting
                  ),
                  undefined
                ],
                [matchers.call.fn(waitForFeatureFlagsToBeLoaded), undefined],
                [select(getWallet), wallet],
                [select(getIsMarketplaceServerEnabled), true],
                [select(getLocation), { pathname }],
                {
                  call(effect, next) {
                    if (
                      effect.fn === CatalogAPI.prototype.get &&
                      effect.args[0] === originalBrowseOptions.filters
                    ) {
                      // Add a setTimeout so it gives time to get it cancelled
                      return new Promise(() => {})
                    }
                    if (
                      effect.fn === CatalogAPI.prototype.get &&
                      effect.args[0] === newBrowseOptions.filters
                    ) {
                      // Mock without timeout
                      return fetchResult
                    }
                    return next()
                  }
                }
              ])
              .call.like({
                fn: CatalogAPI.prototype.get,
                args: [newBrowseOptions.filters]
              })
              .put(
                fetchItemsFailure(
                  FETCH_ITEMS_CANCELLED_ERROR_MESSAGE,
                  originalBrowseOptions
                )
              )
              .put(
                fetchItemsSuccess(
                  fetchResult.data,
                  fetchResult.total,
                  newBrowseOptions,
                  nowTimestamp
                )
              )
              .dispatch(fetchItemsRequest(originalBrowseOptions))
              .dispatch({ type: CANCEL_FETCH_ITEMS })
              .dispatch(fetchItemsRequest(newBrowseOptions))
              .run({ silenceTimeout: true })
          })
        })
      })
    })

    describe('and its dispatches from a path that is not the browse', () => {
      beforeEach(() => {
        pathname = locations.root()
      })
      it('should dispatch a successful action with the fetched items', () => {
        return expectSaga(itemSaga, getIdentity)
          .provide([
            [matchers.call.fn(CatalogAPI.prototype.get), fetchResult],
            [
              matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
              undefined
            ],
            [matchers.call.fn(waitForFeatureFlagsToBeLoaded), undefined],
            [select(getWallet), undefined],
            [select(getLocation), { pathname }],
            [select(getIsMarketplaceServerEnabled), false]
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
  })

  describe('when the request fails', () => {
    it('should dispatch a failing action with the error and the options', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [select(getLocation), { pathname: '' }],
          [select(getWallet), undefined],
          [select(getIsMarketplaceServerEnabled), true],
          [select(getWallet), undefined],
          [matchers.call.fn(CatalogAPI.prototype.get), Promise.reject(anError)],
          [
            matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
            undefined
          ],
          [matchers.call.fn(waitForFeatureFlagsToBeLoaded), undefined]
        ])
        .put(fetchItemsFailure(anError.message, itemBrowseOptions))
        .dispatch(fetchItemsRequest(itemBrowseOptions))
        .run({ silenceTimeout: true })
    })
  })

  describe('when handling the fetch item request action', () => {
    describe('when the request is successful', () => {
      describe('and it is a regular item', () => {
        it('should dispatch a successful action with the fetched items', () => {
          return expectSaga(itemSaga, getIdentity)
            .provide([
              [matchers.call.fn(ItemAPI.prototype.getOne), item],
              [
                matchers.call.fn(
                  waitForWalletConnectionAndIdentityIfConnecting
                ),
                undefined
              ]
            ])
            .put(fetchItemSuccess(item))
            .dispatch(fetchItemRequest(item.contractAddress, item.itemId))
            .run({ silenceTimeout: true })
        })
      })

      describe('and it is a smart wearable', () => {
        let smartWearable: Item
        beforeEach(() => {
          smartWearable = {
            ...item,
            data: {
              ...item.data,
              wearable: {
                isSmart: true,
              }
            },
            urn: 'someUrn'
          } as Item
        })

        it('should dispatch a successful action with the fetched items', () => {
          return expectSaga(itemSaga, getIdentity)
            .provide([
              [matchers.call.fn(ItemAPI.prototype.getOne), smartWearable],
              [
                matchers.call.fn(
                  waitForWalletConnectionAndIdentityIfConnecting
                ),
                undefined
              ]
            ])
            .put(fetchItemSuccess(smartWearable))
            .put(fetchSmartWearableRequiredPermissionsRequest(smartWearable))
            .dispatch(fetchItemRequest(smartWearable.contractAddress, smartWearable.itemId))
            .run({ silenceTimeout: true })
        })
      })
    })

    describe('when the request fails', () => {
      it('should dispatching a failing action with the contract address, the token id and the error message', () => {
        return expectSaga(itemSaga, getIdentity)
          .provide([
            [
              matchers.call.fn(ItemAPI.prototype.getOne),
              Promise.reject(anError)
            ],
            [
              matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
              undefined
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

describe('when handling the fetch trending items request action', () => {
  describe('when the request is successful', () => {
    describe('and there are some trending items', () => {
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

      it('should dispatch a successful action with the fetched trending items', () => {
        return expectSaga(itemSaga, getIdentity)
          .provide([
            [select(getIsMarketplaceServerEnabled), true],
            [matchers.call.fn(ItemAPI.prototype.getTrendings), fetchResult],
            [matchers.call.fn(CatalogAPI.prototype.get), fetchResult],
            [
              matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
              undefined
            ]
          ])
          .put(fetchTrendingItemsSuccess(fetchResult.data))
          .dispatch(fetchTrendingItemsRequest())
          .run({ silenceTimeout: true })
      })
    })

    describe('and there are no trending items', () => {
      const fetchResult = { data: [], total: 0 }

      it('should dispatch a successful action with the fetched trending items', () => {
        return expectSaga(itemSaga, getIdentity)
          .provide([
            // [select(getIsMarketplaceServerEnabled), true],
            [matchers.call.fn(ItemAPI.prototype.getTrendings), fetchResult],
            [
              matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
              undefined
            ]
          ])
          .put(fetchTrendingItemsSuccess(fetchResult.data))
          .dispatch(fetchTrendingItemsRequest())
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('when the request fails', () => {
    it('should dispatch a failing action with the error and the options', () => {
      return expectSaga(itemSaga, getIdentity)
        .provide([
          [
            matchers.call.fn(ItemAPI.prototype.getTrendings),
            Promise.reject(anError)
          ],
          [
            matchers.call.fn(waitForWalletConnectionAndIdentityIfConnecting),
            undefined
          ]
        ])
        .put(fetchTrendingItemsFailure(anError.message))
        .dispatch(fetchTrendingItemsRequest())
        .run({ silenceTimeout: true })
    })
  })
})
