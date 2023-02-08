import { getLocation, push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { Network } from '@dcl/schemas'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  NFTPurchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NetworkGatewayType } from 'decentraland-ui'
import { buyItemWithCardFailure } from '../item/actions'
import { locations } from '../routing/locations'
import { assetSaga } from './sagas'
import { AssetType } from './types'
import { executeOrderWithCardFailure } from '../order/actions'

const mockContractAddress = 'a-contract-address'
const mockTokenId = 'aTokenId'
const mockTradeType = TradeType.PRIMARY

const mockPathname = (assetType: AssetType = AssetType.ITEM) =>
  new URL(
    `${window.origin}${locations.buyWithCard(
      assetType,
      mockContractAddress,
      mockTokenId
    )}`
  ).pathname

const mockNFTPurchase: NFTPurchase = {
  address: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
  id: 'mock-id',
  network: Network.MATIC,
  timestamp: 1535398843748,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash: 'aTxHash',
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

    describe('and the user was redirected to the processing page and the purchase changed it status', () => {
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

  describe('when the purchase of an item failed', () => {
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
        .put(
          push(
            locations.buyWithCard(
              AssetType.ITEM,
              mockContractAddress,
              mockTokenId
            )
          )
        )
        .dispatch(
          setPurchase({ ...mockNFTPurchase, status: PurchaseStatus.FAILED })
        )
        .run({ silenceTimeout: true })
    })
  })

  describe('when the purchase of an nft failed', () => {
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
        .put(
          push(
            locations.buyWithCard(
              AssetType.NFT,
              mockContractAddress,
              mockTokenId
            )
          )
        )
        .dispatch(
          setPurchase({
            ...mockNFTPurchase,
            status: PurchaseStatus.FAILED,
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
