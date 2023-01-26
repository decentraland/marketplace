import { expectSaga } from 'redux-saga-test-plan'
import { getLocation, push } from 'connected-react-router'
import { Network } from '@dcl/schemas'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  Purchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { NetworkGatewayType } from 'decentraland-ui'
import { locations } from '../routing/locations'
import { assetSaga } from './sagas'
import { AssetType } from './types'
import { select } from 'redux-saga/effects'

const mockContractAddress = 'a-contract-address'
const mockTokenId = 'aTokenId'
const mockTradeType = TradeType.PRIMARY

const mockPathname = new URL(
  `${window.origin}${locations.buyWithCard(
    AssetType.ITEM,
    mockContractAddress,
    mockTokenId
  )}`
).pathname

const mockNFTPurchase: Purchase = {
  address: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
  id: 'mock-id',
  network: Network.MATIC,
  timestamp: 1535398843748,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash: null,
  amount: 1,
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
    describe('when the user still waiting for the purchase in the same page', () => {
      it('should dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: mockPathname
              }
            ]
          ])
          .put(
            push(
              locations.buyStatusPage(
                AssetType.ITEM,
                mockContractAddress,
                mockTokenId
              )
            )
          )
          .dispatch(setPurchase(mockNFTPurchase))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the user was redirected to the processing page and the purchase changed it status', () => {
      it('should dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: locations.buyStatusPage(
                  AssetType.ITEM,
                  mockContractAddress,
                  mockTokenId
                )
              }
            ]
          ])
          .put(
            push(
              locations.buyStatusPage(
                AssetType.ITEM,
                mockContractAddress,
                mockTokenId
              )
            )
          )
          .dispatch(setPurchase(mockNFTPurchase))
          .run({ silenceTimeout: true })
      })
    })

    describe('when the user was exploring collectibles', () => {
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
  })

  describe('when the purchase failed', () => {
    describe('when the user was waiting in the same page', () => {
      it('should not dispatch a push to the history with the location of the buy status page', () => {
        return expectSaga(assetSaga)
          .provide([
            [
              select(getLocation),
              {
                pathname: mockPathname
              }
            ]
          ])
          .dispatch(
            setPurchase({ ...mockNFTPurchase, status: PurchaseStatus.FAILED })
          )
          .run({ silenceTimeout: true })
          .then(({ effects }) => {
            expect(effects.put).toBeUndefined()
          })
      })
    })

    describe('when the user was exploring collectibles', () => {
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
  })
})
