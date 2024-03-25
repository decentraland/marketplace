import util from 'util'
import { getLocation, push } from 'connected-react-router'
import { call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { Network } from '@dcl/schemas'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { NFTPurchase, PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NetworkGatewayType } from 'decentraland-ui'
import { getSmartWearableRequiredPermissions, getSmartWearableVideoShowcase } from '../../lib/asset'
import { buyItemWithCardFailure } from '../item/actions'
import { NFT } from '../nft/types'
import { executeOrderWithCardFailure } from '../order/actions'
import { locations } from '../routing/locations'
import {
  fetchSmartWearableRequiredPermissionsFailure,
  fetchSmartWearableRequiredPermissionsRequest,
  fetchSmartWearableRequiredPermissionsSuccess,
  fetchSmartWearableVideoHashFailure,
  fetchSmartWearableVideoHashRequest,
  fetchSmartWearableVideoHashSuccess
} from './actions'
import { assetSaga, failStatuses } from './sagas'
import { Asset, AssetType } from './types'

util.inspect.defaultOptions.depth = null

const mockContractAddress = 'a-contract-address'
const mockTokenId = 'aTokenId'
const mockTradeType = TradeType.PRIMARY

const mockPathname = (assetType: AssetType = AssetType.ITEM) =>
  new URL(`${window.origin}${locations.buyWithCard(assetType, mockContractAddress, mockTokenId)}`).pathname

const mockNFTPurchase: NFTPurchase = {
  address: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
  id: 'mock-id',
  network: Network.MATIC,
  timestamp: 1535398843748,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash: 'aTxHash',
  paymentMethod: 'aPaymentMethod',
  nft: {
    contractAddress: mockContractAddress,
    itemId: mockTokenId,
    tokenId: undefined,
    tradeType: mockTradeType,
    cryptoAmount: 100
  }
}

describe('when handling the set purchase action', () => {
  describe('when an NFT has been purchased and it is in status pending', () => {
    describe('and the user still waiting for the purchase in the same page', () => {
      it('should dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: mockPathname()
              }
            ]
          ])
          .put(push(locations.buyStatusPage(AssetType.ITEM, mockContractAddress, mockTokenId)))
          .dispatch(setPurchase(mockNFTPurchase))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the user was redirected to the processing page and the purchase changed it status', () => {
      it('should dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: locations.buyStatusPage(AssetType.ITEM, mockContractAddress, mockTokenId)
              }
            ]
          ])
          .put(push(locations.buyStatusPage(AssetType.ITEM, mockContractAddress, mockTokenId)))
          .dispatch(setPurchase(mockNFTPurchase))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the user was exploring collectibles', () => {
      it('should not dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: locations.browse()
              }
            ]
          ])
          .dispatch(setPurchase(mockNFTPurchase))
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('and the tx hash has not yet been setted', () => {
      it('should not dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: locations.browse()
              }
            ]
          ])
          .dispatch(setPurchase({ ...mockNFTPurchase, txHash: null }))
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })
  })

  describe.each([PurchaseStatus.FAILED, PurchaseStatus.CANCELLED, PurchaseStatus.REFUNDED])(
    'when the purchase of an item has a status %s',
    (status: PurchaseStatus) => {
      it('should dispatch an action signaling the failure of the item', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: mockPathname()
              }
            ]
          ])
          .put(buyItemWithCardFailure(t('global.unknown_error')))
          .put(push(locations.buyWithCard(AssetType.ITEM, mockContractAddress, mockTokenId)))
          .dispatch(setPurchase({ ...mockNFTPurchase, status }))
          .run({ silenceTimeout: true })
      })
    }
  )

  describe.each(failStatuses)('when the purchase of an nft has a status %s', status => {
    it('should dispatch an action signaling the failure of the nft', () => {
      return expectSaga(assetSaga)
        .provide([
          [
            select(getLocation),
            {
              pathname: mockPathname(AssetType.NFT)
            }
          ]
        ])
        .put(executeOrderWithCardFailure(t('global.unknown_error')))
        .put(push(locations.buyWithCard(AssetType.NFT, mockContractAddress, mockTokenId)))
        .dispatch(
          setPurchase({
            ...mockNFTPurchase,
            status,
            nft: {
              ...mockNFTPurchase.nft,
              tokenId: mockTokenId,
              itemId: undefined,
              tradeType: TradeType.SECONDARY
            }
          })
        )
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the fetch smart wearable required permissions request action', () => {
  let asset: Asset

  beforeEach(() => {
    asset = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      data: {}
    } as unknown as Asset
  })

  describe('when the asset is not smart wearable', () => {
    it('should dispatch an action signaling the success of the request with an empty array of required permissions', () => {
      return expectSaga(assetSaga)
        .put(fetchSmartWearableRequiredPermissionsSuccess(asset, []))
        .dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the asset is a smart wearable but does not have an urn', () => {
    beforeEach(() => {
      asset = {
        ...asset,
        data: {
          wearable: {
            isSmart: true
          } as NFT['data']['wearable']
        }
      }
    })

    it('should dispatch an action signaling the success of the request with an empty array of required permissions', () => {
      return expectSaga(assetSaga)
        .put(fetchSmartWearableRequiredPermissionsSuccess(asset, []))
        .dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the asset is a smart wearable and has an urn', () => {
    const urn = 'anUrn'
    beforeEach(() => {
      asset = {
        ...asset,
        data: {
          wearable: {
            isSmart: true
          } as NFT['data']['wearable']
        },
        urn
      }
    })

    describe('and the fetch process fails', () => {
      const anErrorMessage = 'An error'
      it('should dispatch an action signaling the failure of the request', () => {
        return expectSaga(assetSaga)
          .provide([[call(getSmartWearableRequiredPermissions, urn), Promise.reject(new Error(anErrorMessage))]])
          .put(fetchSmartWearableRequiredPermissionsFailure(asset, anErrorMessage))
          .dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the fetch process succeeds', () => {
      it('should dispatch an action signaling the succeed of the request', () => {
        return expectSaga(assetSaga)
          .provide([[call(getSmartWearableRequiredPermissions, urn), []]])
          .put(fetchSmartWearableRequiredPermissionsSuccess(asset, []))
          .dispatch(fetchSmartWearableRequiredPermissionsRequest(asset))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the fetch smart wearable video hash request action', () => {
  let asset: Asset

  beforeEach(() => {
    asset = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      data: {}
    } as unknown as Asset
  })

  describe('when the asset is not smart wearable', () => {
    it('should dispatch an action signaling the success of the request with an undefined video hash', () => {
      return expectSaga(assetSaga)
        .put(fetchSmartWearableVideoHashSuccess(asset, undefined))
        .dispatch(fetchSmartWearableVideoHashRequest(asset))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the asset is a smart wearable but does not have an urn', () => {
    beforeEach(() => {
      asset = {
        ...asset,
        data: {
          wearable: {
            isSmart: true
          } as NFT['data']['wearable']
        }
      }
    })

    it('should dispatch an action signaling the success of the request with an undefined video hash', () => {
      return expectSaga(assetSaga)
        .put(fetchSmartWearableVideoHashSuccess(asset, undefined))
        .dispatch(fetchSmartWearableVideoHashRequest(asset))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the asset is a smart wearable and has an urn', () => {
    const urn = 'anUrn'
    beforeEach(() => {
      asset = {
        ...asset,
        data: {
          wearable: {
            isSmart: true
          } as NFT['data']['wearable']
        },
        urn
      }
    })

    describe('and the fetch process fails', () => {
      const anErrorMessage = 'An error'
      it('should dispatch an action signaling the failure of the request', () => {
        return expectSaga(assetSaga)
          .provide([[call(getSmartWearableVideoShowcase, asset), Promise.reject(new Error(anErrorMessage))]])
          .put(fetchSmartWearableVideoHashFailure(asset, anErrorMessage))
          .dispatch(fetchSmartWearableVideoHashRequest(asset))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the fetch process succeeds', () => {
      const videoHash = 'aVideoHash'

      it('should dispatch an action signaling the succeed of the request', () => {
        return expectSaga(assetSaga)
          .provide([[call(getSmartWearableVideoShowcase, asset), videoHash]])
          .put(fetchSmartWearableVideoHashSuccess(asset, videoHash))
          .dispatch(fetchSmartWearableVideoHashRequest(asset))
          .run({ silenceTimeout: true })
      })
    })
  })
})
