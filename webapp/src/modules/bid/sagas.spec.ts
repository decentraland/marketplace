import { call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { Bid, RentalListing, RentalStatus } from '@dcl/schemas'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { getContract } from '../contract/selectors'
import { getCurrentNFT } from '../nft/selectors'
import { NFT } from '../nft/types'
import { getRentalById } from '../rental/selectors'
import { waitUntilRentalChangesStatus } from '../rental/utils'
import { Vendor, VendorFactory, VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import { getWallet } from '../wallet/selectors'
import { acceptBidFailure, acceptBidtransactionSubmitted, acceptBidRequest, acceptBidSuccess } from './actions'
import { bidSaga } from './sagas'

describe('when handling the accepting a bid action', () => {
  let wallet: Wallet
  let address: string
  beforeEach(() => {
    address = 'anAddress'
    wallet = { address } as Wallet
  })

  describe('and getting the contract fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const bid = {
        contractAddress: '0x123'
      } as Bid

      return expectSaga(bidSaga)
        .provide([[select(getContract, { address: bid.contractAddress }), undefined]])
        .put(acceptBidFailure(bid, `Couldn't find a valid vendor for contract ${bid.contractAddress}`))
        .dispatch(acceptBidRequest(bid))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the contract doesn't exist for the given vendor", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const contractAddress = 'anAddress'
      const contract = {
        vendor: 'someVendor' as VendorName,
        address: contractAddress
      }
      const error = `Couldn't find a valid vendor for contract ${contractAddress}`
      const bid = {
        contractAddress: contract.address
      } as Bid

      return expectSaga(bidSaga)
        .provide([
          [select(getContract, { address: bid.contractAddress }), contract],
          [select(getWallet), wallet],
          [call([VendorFactory, 'build'], contract.vendor), throwError(new Error(error))]
        ])
        .put(acceptBidFailure(bid, error))
        .dispatch(acceptBidRequest(bid))
        .run({ silenceTimeout: true })
    })
  })

  describe('when accepting a bid request fails', () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const bid = {
        contractAddress: '0x123'
      } as Bid
      const error = { message: 'anError' }
      const contract = {
        vendor: VendorName.DECENTRALAND
      }
      const vendor = VendorFactory.build(contract.vendor)

      return expectSaga(bidSaga)
        .provide([
          [select(getContract, { address: bid.contractAddress }), contract],
          [call([VendorFactory, 'build'], contract.vendor), vendor],
          [select(getWallet), wallet],
          [call([vendor.bidService!, 'accept'], wallet, bid), Promise.reject(error)]
        ])
        .put(acceptBidFailure(bid, error.message))
        .dispatch(acceptBidRequest(bid))
        .run({ silenceTimeout: true })
    })
  })

  describe('and sending the transaction is successful', () => {
    let nft: NFT
    let contract: Contract
    let vendor: Vendor<VendorName.DECENTRALAND>
    let txHash: string
    let bid: Bid
    let address: string
    let wallet: Wallet
    beforeEach(() => {
      nft = {
        vendor: VendorName.DECENTRALAND,
        openRentalId: 'aRentalId'
      } as NFT
      contract = {
        vendor: VendorName.DECENTRALAND
      } as Contract
      vendor = VendorFactory.build(contract.vendor!)
      txHash = 'someHash'
      bid = {
        contractAddress: '0x123',
        price: '1'
      } as Bid
      address = 'anAddress'
      wallet = { address } as Wallet
    })

    describe('and the transaction finishes', () => {
      describe('and it has an rental with status OPEN', () => {
        let rental: RentalListing
        beforeEach(() => {
          nft.openRentalId = 'aRentalId'
          rental = {
            id: nft.openRentalId,
            status: RentalStatus.OPEN
          } as RentalListing
        })
        it('should dispatch an action signaling the success of the action handling and cancel an existing rental listing', () => {
          return expectSaga(bidSaga)
            .provide([
              [select(getContract, { address: bid.contractAddress }), contract],
              [call([VendorFactory, 'build'], contract.vendor!), vendor],
              [select(getWallet), wallet],
              [select(getCurrentNFT), nft],
              [select(getRentalById, nft.openRentalId!), rental],
              [call([vendor.bidService!, 'accept'], wallet, bid), Promise.resolve(txHash)],
              [call(waitForTx, txHash), Promise.resolve()],
              [call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED), Promise.resolve()]
            ])
            .put(acceptBidSuccess(bid))
            .put(acceptBidtransactionSubmitted(bid, txHash))
            .dispatch(acceptBidRequest(bid))
            .run({ silenceTimeout: true })
        })
      })

      describe('and it does not have a rental', () => {
        beforeEach(() => {
          nft.openRentalId = null
        })
        it('should dispatch an action signaling the success of the action handling', () => {
          return expectSaga(bidSaga)
            .provide([
              [select(getContract, { address: bid.contractAddress }), contract],
              [call([VendorFactory, 'build'], contract.vendor!), vendor],
              [select(getWallet), wallet],
              [select(getCurrentNFT), nft],
              [call([vendor.bidService!, 'accept'], wallet, bid), Promise.resolve(txHash)],
              [call(waitForTx, txHash), Promise.resolve()]
            ])
            .put(acceptBidSuccess(bid))
            .put(acceptBidtransactionSubmitted(bid, txHash))
            .dispatch(acceptBidRequest(bid))
            .run({ silenceTimeout: true })
        })
      })
    })
    describe('and the transaction gets reverted', () => {
      it('should put the action to notify that the transaction was submitted and the claim LAND failure action with an error', () => {
        return expectSaga(bidSaga)
          .provide([
            [select(getContract, { address: bid.contractAddress }), contract],
            [call([VendorFactory, 'build'], contract.vendor!), vendor],
            [select(getWallet), wallet],
            [select(getCurrentNFT), nft],
            [call([vendor.bidService!, 'accept'], wallet, bid), Promise.resolve(txHash)],
            [call(waitForTx, txHash), Promise.reject(new Error('anError'))]
          ])
          .put(acceptBidFailure(bid, 'anError'))
          .put(acceptBidtransactionSubmitted(bid, txHash))
          .dispatch(acceptBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })
  })
})
