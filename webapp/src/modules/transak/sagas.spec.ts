import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { v4 as uuidv4 } from 'uuid'
import {
  BodyShape,
  ChainId,
  ListingStatus,
  Network,
  NFTCategory,
  Order,
  Rarity,
  Trade,
  TradeAssetType,
  TradeType,
  WearableCategory
} from '@dcl/schemas'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { Transak } from 'decentraland-dapps/dist/modules/gateway/transak'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { ContractName, getContract } from 'decentraland-transactions'
import { Asset } from '../asset/types'
import { getIsCreditsEnabled } from '../features/selectors'
import { getWallet } from '../wallet/selectors'
import { openTransak, openTransakFailure } from './actions'
import { transakSaga } from './sagas'

jest.mock('decentraland-dapps/dist/modules/gateway/transak')

jest.mock('../../config', () => ({
  config: {
    get: (key: string) => {
      const mockConfig = {
        MARKETPLACE_SERVER_URL: 'http://localhost:3000',
        TRANSAK_KEY: 'mock-key',
        TRANSAK_ENV: 'STAGING',
        TRANSAK_POLLING_DELAY: '1000',
        TRANSAK_PUSHER_APP_KEY: 'mock-pusher-key',
        TRANSAK_PUSHER_APP_CLUSTER: 'mock-cluster'
      }
      return mockConfig[key as keyof typeof mockConfig]
    }
  }
}))

const mockAsset: Asset = {
  id: 'mock-asset-id',
  chainId: ChainId.MATIC_AMOY,
  contractAddress: '0x0000000000000000000000000000000000000123',
  network: Network.MATIC,
  price: '1000000000000000000', // 1 MANA
  tokenId: '1',
  itemId: '1',
  name: 'Mock Asset',
  thumbnail: 'thumbnail.png',
  url: 'https://mock.url',
  category: NFTCategory.WEARABLE,
  rarity: Rarity.UNIQUE,
  available: 1,
  isOnSale: true,
  creator: '0x0000000000000000000000000000000000000123',
  beneficiary: null,
  createdAt: 0,
  updatedAt: 0,
  reviewedAt: 0,
  soldAt: 0,
  urn: 'mock:urn',
  firstListedAt: 0,
  data: {
    wearable: {
      description: 'Mock wearable',
      category: WearableCategory.EYEBROWS,
      bodyShapes: [BodyShape.MALE],
      isSmart: false,
      rarity: Rarity.UNIQUE
    }
  }
}

const mockWallet = {
  address: '0x0000000000000000000000000000000000000123',
  networks: {
    [Network.MATIC]: {
      chainId: ChainId.MATIC_MAINNET
    }
  }
}

const mockOrder: Order = {
  id: 'mock-order-id',
  marketplaceAddress: '0x0c8ad1f6aadf89d2eb19f01a100a6143108fe2b0',
  contractAddress: '0x0000000000000000000000000000000000000123',
  tokenId: '1',
  owner: '0x0000000000000000000000000000000000000123',
  buyer: null,
  price: '1000000000000000000', // 1 MANA
  status: ListingStatus.OPEN,
  expiresAt: Date.now() + 1000000,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  network: Network.MATIC,
  chainId: ChainId.MATIC_AMOY,
  issuedId: '1'
}

const mockCredits = {
  totalCredits: '500000000000000000', // 0.5 MANA
  credits: [
    {
      id: '1',
      amount: '500000000000000000',
      availableAmount: '500000000000000000',
      contract: '0x0000000000000000000000000000000000000123',
      expiresAt: '1000',
      season: 1,
      signature: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '1000',
      userAddress: '0x0000000000000000000000000000000000000123'
    }
  ]
}

const mockTrade: Trade = {
  contract: getContract(ContractName.OffChainMarketplaceV2, ChainId.ETHEREUM_SEPOLIA).address,
  id: 'trade1',
  createdAt: Date.now(),
  signer: '0x0000000000000000000000000000000000000123',
  signature: '0x0000000000000000000000000000000000000000000000000000000000000000',
  type: TradeType.PUBLIC_NFT_ORDER,
  network: Network.MATIC,
  chainId: ChainId.MATIC_AMOY,
  checks: {
    expiration: Date.now() + 100000000000,
    effective: Date.now(),
    uses: 1,
    salt: '0x',
    allowedRoot: '0x',
    contractSignatureIndex: 0,
    externalChecks: [],
    signerSignatureIndex: 0
  },
  sent: [
    {
      assetType: TradeAssetType.ERC721,
      contractAddress: '0x7ad72b9f944ea9793cf4055d88f81138cc2c63a0',
      tokenId: '1',
      extra: ''
    }
  ],
  received: [
    {
      assetType: TradeAssetType.ERC20,
      contractAddress: '0x7ad72b9f944ea9793cf4055d88f81138cc2c63a0',
      amount: '2000000000000000000',
      extra: '',
      beneficiary: '0x0000000000000000000000000000000000000123'
    }
  ],
  contract: getContract(ContractName.OffChainMarketplaceV2, ChainId.MATIC_AMOY).address
}

describe('when handling the open transak action', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when there is no wallet connected', () => {
    beforeEach(() => {
      jest.spyOn(Transak.prototype, 'openWidget').mockImplementation(() => Promise.resolve())
    })
    it('should not open the Transak widget', () => {
      return expectSaga(transakSaga, () => undefined)
        .provide([[select(getWallet), null]])
        .dispatch(openTransak(mockAsset))
        .run({ silenceTimeout: true })
        .then(() => {
          expect(Transak.prototype.openWidget).not.toHaveBeenCalled()
        })
    })
  })

  describe('when the order has a tradeId', () => {
    beforeEach(() => {
      mockOrder.tradeId = uuidv4()
    })
    describe('and using credits', () => {
      describe('and credits are enabled', () => {
        describe('and the user has enough credits', () => {
          it('should open the Transak widget with the correct configuration for credits', () => {
            return expectSaga(transakSaga, () => undefined)
              .provide([
                [select(getWallet), mockWallet],
                [select(getAddress), mockWallet.address],
                [select(getIsCreditsEnabled), true],
                [select(getCredits, mockWallet.address), mockCredits],
                [matchers.call.fn(TradeService.prototype.fetchTrade), mockTrade]
              ])
              .put(closeAllModals())
              .dispatch(openTransak(mockAsset, mockOrder, true))
              .run({ silenceTimeout: true })
              .then(() => {
                expect(Transak.prototype.openWidget).toHaveBeenCalledWith(
                  expect.objectContaining({
                    walletAddress: mockWallet.address,
                    network: Network.MATIC
                  })
                )
              })
          })
        })

        describe('and the user does not have enough credits', () => {
          it('should throw an error', () => {
            return expectSaga(transakSaga, () => undefined)
              .provide([
                [select(getWallet), mockWallet],
                [select(getAddress), mockWallet.address],
                [select(getIsCreditsEnabled), true],
                [select(getCredits, mockWallet.address), undefined],
                [matchers.call.fn(TradeService.prototype.fetchTrade), mockTrade]
              ])
              .dispatch(openTransak(mockAsset, mockOrder, true))
              .put(openTransakFailure('No credits available'))
              .run()
              .then(({ effects }) => {
                expect(effects.put).toBeUndefined()
                expect(Transak.prototype.openWidget).not.toHaveBeenCalled()
              })
          })
        })
      })

      describe('and credits are not enabled', () => {
        it('should throw an error', () => {
          return expectSaga(transakSaga, () => undefined)
            .provide([
              [select(getWallet), mockWallet],
              [select(getIsCreditsEnabled), false],
              [select(getCredits, mockWallet.address), mockCredits],
              [matchers.call.fn(TradeService.prototype.fetchTrade), mockTrade]
            ])
            .dispatch(openTransak(mockAsset, mockOrder, true))
            .put(openTransakFailure('Credits are not enabled'))
            .run()
            .then(({ effects }) => {
              expect(effects.put).toBeUndefined()
              expect(Transak.prototype.openWidget).not.toHaveBeenCalled()
            })
        })
      })
    })

    describe('when not using credits', () => {
      describe('and the asset has a trade', () => {
        it('should open the Transak widget with the correct configuration for marketplace v3', () => {
          return expectSaga(transakSaga, () => undefined)
            .provide([
              [select(getWallet), mockWallet],
              [select(getAddress), mockWallet.address],
              [select(getIsCreditsEnabled), false],
              [matchers.call.fn(TradeService.prototype.fetchTrade), mockTrade]
            ])
            .put(closeAllModals())
            .dispatch(openTransak({ ...mockAsset, tradeId: 'mock-trade-id' }))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(Transak.prototype.openWidget).toHaveBeenCalledWith(
                expect.objectContaining({
                  walletAddress: mockWallet.address,
                  network: Network.MATIC
                })
              )
            })
        })
      })

      describe('and the asset has an order', () => {
        beforeEach(() => {
          mockOrder.tradeId = undefined
        })
        it('should open the Transak widget with the correct configuration for marketplace v2', () => {
          return expectSaga(transakSaga, () => undefined)
            .provide([
              [select(getWallet), mockWallet],
              [select(getAddress), mockWallet.address],
              [select(getIsCreditsEnabled), false]
            ])
            .put(closeAllModals())
            .dispatch(openTransak(mockAsset, mockOrder))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(Transak.prototype.openWidget).toHaveBeenCalledWith(
                expect.objectContaining({
                  walletAddress: mockWallet.address,
                  network: Network.MATIC
                })
              )
            })
        })
      })

      describe('and the asset is a collection store item', () => {
        it('should open the Transak widget with the correct configuration for collection store', () => {
          const collectionStoreAsset: Asset = {
            ...mockAsset,
            itemId: '1',
            data: {
              ...mockAsset.data,
              wearable: {
                ...mockAsset.data.wearable,
                isSmart: false,
                description: 'Mock wearable',
                category: WearableCategory.EYEBROWS,
                bodyShapes: [BodyShape.MALE],
                rarity: Rarity.UNIQUE
              }
            }
          }

          return expectSaga(transakSaga, () => undefined)
            .provide([
              [select(getWallet), mockWallet],
              [select(getAddress), mockWallet.address],
              [select(getIsCreditsEnabled), false]
            ])
            .put(closeAllModals())
            .dispatch(openTransak(collectionStoreAsset))
            .run({ silenceTimeout: true })
            .then(() => {
              expect(Transak.prototype.openWidget).toHaveBeenCalledWith(
                expect.objectContaining({
                  walletAddress: mockWallet.address,
                  network: Network.MATIC
                })
              )
            })
        })
      })
    })
  })

  describe('when the multicall contract is not found', () => {
    it('should throw an error', () => {
      const invalidNetworkAsset: Asset = {
        ...mockAsset,
        network: Network.ETHEREUM
      }

      return expectSaga(transakSaga, () => undefined)
        .provide([
          [select(getWallet), mockWallet],
          [select(getIsCreditsEnabled), false]
        ])
        .dispatch(openTransak(invalidNetworkAsset))
        .put(
          openTransakFailure(
            `Transak multicall contract not found for network ${invalidNetworkAsset.network} and chainId ${invalidNetworkAsset.chainId}`
          )
        )
        .run()
        .then(({ effects }) => {
          expect(effects.put).toBeUndefined()
          expect(Transak.prototype.openWidget).not.toHaveBeenCalled()
        })
    })
  })
})
