import { push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { throwError } from 'redux-saga-test-plan/providers'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorFactory, VendorName } from '../vendor'
import { getWallet } from '../wallet/selectors'
import { locations } from '../routing/locations'
import {
  transferNFTFailure,
  transferNFTRequest,
  transferNFTSuccess
} from './actions'
import { nftSaga } from './sagas'
import { NFT } from './types'

describe('when handling the transfer NFT request action', () => {
  describe("when the NFT's vendor doesn't exist", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const nft = {
        vendor: 'somethingWrong' as VendorName
      } as NFT
      const address = 'anAddress'
      const error = 'someError'

      return expectSaga(nftSaga)
        .provide([
          [call(VendorFactory.build, nft.vendor), throwError(new Error(error))]
        ])
        .put(transferNFTFailure(nft, address, error))
        .dispatch(transferNFTRequest(nft, address))
        .run({ silenceTimeout: true })
    })
  })

  describe("when there's no wallet", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const nft = {
        vendor: VendorName.DECENTRALAND
      } as NFT
      const address = 'anAddress'
      const error = 'A wallet is needed to perform a NFT transfer request'

      return expectSaga(nftSaga)
        .provide([
          [
            call(VendorFactory.build, nft.vendor),
            VendorFactory.build(nft.vendor)
          ],
          [select(getWallet), null]
        ])
        .put(transferNFTFailure(nft, address, error))
        .dispatch(transferNFTRequest(nft, address))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the transfer request fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const nft = {
        vendor: VendorName.DECENTRALAND
      } as NFT
      const wallet = {} as Wallet
      const vendor = VendorFactory.build(nft.vendor)
      const address = 'anAddress'
      const error = { message: 'anError' }

      return expectSaga(nftSaga)
        .provide([
          [call(VendorFactory.build, nft.vendor), vendor],
          [select(getWallet), wallet],
          [
            call([vendor.nftService, 'transfer'], wallet, address, nft),
            Promise.reject(error)
          ]
        ])
        .put(transferNFTFailure(nft, address, error.message))
        .dispatch(transferNFTRequest(nft, address))
        .run({ silenceTimeout: true })
    })
  })

  describe('when the transfer is successful', () => {
    it('should dispatch an action signaling the success of the action handling and the change of the location', () => {
      const nft = {
        vendor: VendorName.DECENTRALAND
      } as NFT
      const wallet = {} as Wallet
      const vendor = VendorFactory.build(nft.vendor)
      const address = 'anAddress'
      const txHash = 'someHash'

      return expectSaga(nftSaga)
        .provide([
          [call(VendorFactory.build, nft.vendor), vendor],
          [select(getWallet), wallet],
          [
            call([vendor.nftService, 'transfer'], wallet, address, nft),
            Promise.resolve(txHash)
          ]
        ])
        .put(transferNFTSuccess(nft, address, txHash))
        .put(push(locations.activity()))
        .dispatch(transferNFTRequest(nft, address))
        .run({ silenceTimeout: true })
    })
  })
})
