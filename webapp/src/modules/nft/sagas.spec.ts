import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { throwError } from 'redux-saga-test-plan/providers'
import * as matchers from 'redux-saga-test-plan/matchers'
import { NFTCategory, Order, RentalListing, RentalStatus } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Vendor, VendorFactory, VendorName } from '../vendor'
import { getWallet } from '../wallet/selectors'
import {
  DEFAULT_BASE_NFT_PARAMS,
  fetchNFTFailure,
  fetchNFTRequest,
  fetchNFTsFailure,
  fetchNFTsRequest,
  fetchNFTsSuccess,
  fetchNFTSuccess,
  transferNFTFailure,
  transferNFTRequest,
  transferNFTSuccess
} from './actions'
import { nftSaga } from './sagas'
import { NFT, NFTsFetchOptions, NFTsFetchParams } from './types'
import { View } from '../ui/types'
import { Account } from '../account/types'
import { getContract, getContracts, getLoading } from '../contract/selectors'
import { waitUntilRentalChangesStatus } from '../rental/utils'
import { getRentalById } from '../rental/selectors'

describe('when handling the fetch NFTs request action', () => {
  let dateSpy: jest.SpyInstance<number, []>
  const timestamp = 123456789

  beforeEach(() => {
    dateSpy = jest.spyOn(Date, 'now')
    dateSpy.mockImplementation(() => timestamp)
  })

  afterEach(() => {
    dateSpy.mockRestore()
  })

  describe("when the NFTs' vendor doesn't exist", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const options: NFTsFetchOptions = {
        vendor: 'aVendorName' as VendorName,
        filters: {},
        view: View.MARKET,
        params: {} as NFTsFetchParams
      }
      const error = 'someError'

      return expectSaga(nftSaga)
        .provide([
          [select(getContracts), []],
          [
            call(VendorFactory.build, options.vendor),
            throwError(new Error(error))
          ]
        ])
        .put(fetchNFTsFailure(options, error, timestamp))
        .dispatch(fetchNFTsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the NFTs' fetch request fails", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const options: NFTsFetchOptions = {
        vendor: VendorName.DECENTRALAND,
        filters: {},
        view: View.MARKET,
        params: {} as NFTsFetchParams
      }
      const vendor = VendorFactory.build(options.vendor)
      const error = { message: 'someError' }

      return expectSaga(nftSaga)
        .provide([
          [select(getContracts), []],
          [call(VendorFactory.build, options.vendor), vendor],
          [matchers.call.fn(vendor.nftService.fetch), Promise.reject(error)]
        ])
        .put(fetchNFTsFailure(options, error.message, timestamp))
        .dispatch(fetchNFTsRequest(options))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the NFTs' fetch is successful", () => {
    it('should dispatch an action signaling the success of the fetching of NFTs', () => {
      const options: NFTsFetchOptions = {
        vendor: VendorName.DECENTRALAND,
        filters: {},
        view: View.MARKET,
        params: {} as NFTsFetchParams
      }
      const vendor = VendorFactory.build(options.vendor)
      const nfts = [{ id: 'anID' }] as NFT[]
      const accounts = [{ address: 'someAddress' }] as Account[]
      const orders = [{ id: 'anotherID' }] as Order[]
      const rentals = [{ id: 'aRentalId' }] as RentalListing[]
      const count = 1

      return expectSaga(nftSaga)
        .provide([
          [select(getContracts), []],
          [call(VendorFactory.build, options.vendor), vendor],
          [
            call(
              [vendor.nftService, 'fetch'],
              { ...DEFAULT_BASE_NFT_PARAMS, ...options.params, contracts: [] },
              options.filters
            ),
            [nfts, accounts, orders, rentals, count]
          ]
        ])
        .put(
          fetchNFTsSuccess(
            options,
            nfts,
            accounts,
            orders,
            rentals,
            count,
            timestamp
          )
        )
        .dispatch(fetchNFTsRequest(options))
        .run({ silenceTimeout: true })
    })
  })
})

describe('when handling the fetch NFT request action', () => {
  describe("when the contract doesn't exist", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const contractAddress = 'anAddress'
      const tokenId = 'aTokenId'
      const error = 'Contract not found'

      return expectSaga(nftSaga)
        .provide([
          [select(getLoading), []],
          [select(getContracts), []],
          [
            select(getContract, { address: contractAddress }),
            throwError(new Error(error))
          ]
        ])
        .put(fetchNFTFailure(contractAddress, tokenId, error))
        .dispatch(fetchNFTRequest(contractAddress, tokenId))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the contract's vendor doesn't exist", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const contractAddress = 'anAddress'
      const contract = {
        vendor: null,
        address: contractAddress
      }
      const tokenId = 'aTokenId'
      const error = `Couldn't find a valid vendor for contract ${contractAddress}`

      return expectSaga(nftSaga)
        .provide([
          [select(getLoading), []],
          [select(getContracts), []],
          [select(getContract, { address: contractAddress }), contract]
        ])
        .put(fetchNFTFailure(contractAddress, tokenId, error))
        .dispatch(fetchNFTRequest(contractAddress, tokenId))
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
      const tokenId = 'aTokenId'
      const error = `Couldn't find a valid vendor for contract ${contractAddress}`

      return expectSaga(nftSaga)
        .provide([
          [select(getLoading), []],
          [select(getContracts), []],
          [select(getContract, { address: contractAddress }), contract],
          [
            call(VendorFactory.build, contract.vendor),
            throwError(new Error(error))
          ]
        ])
        .put(fetchNFTFailure(contractAddress, tokenId, error))
        .dispatch(fetchNFTRequest(contractAddress, tokenId))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the NFT's fetch request fails", () => {
    it('should dispatch an action signaling the failure of the action handling', () => {
      const contractAddress = 'anAddress'
      const contract = {
        vendor: 'someVendor' as VendorName.DECENTRALAND,
        address: contractAddress
      }
      const tokenId = 'aTokenId'
      const vendor = VendorFactory.build(VendorName.DECENTRALAND)
      const error = { message: 'someError' }

      return expectSaga(nftSaga)
        .provide([
          [select(getLoading), []],
          [select(getContracts), []],
          [select(getContract, { address: contractAddress }), contract],
          [call(VendorFactory.build, contract.vendor), vendor],
          [
            call(
              [vendor.nftService, 'fetchOne'],
              contractAddress,
              tokenId,
              undefined
            ),
            Promise.reject(error)
          ]
        ])
        .put(fetchNFTFailure(contractAddress, tokenId, error.message))
        .dispatch(fetchNFTRequest(contractAddress, tokenId))
        .run({ silenceTimeout: true })
    })
  })

  describe("when the NFT's fetch request is successful", () => {
    it('should dispatch an action signaling the success of the action handling', () => {
      const contractAddress = 'anAddress'
      const contract = {
        vendor: VendorName.DECENTRALAND,
        address: contractAddress
      }
      const tokenId = 'aTokenId'
      const vendor = VendorFactory.build(VendorName.DECENTRALAND)
      const nft = { category: NFTCategory.WEARABLE } as NFT
      const order = { id: 'anId' } as Order
      const rental = { id: 'aRentalId' } as RentalListing

      return expectSaga(nftSaga)
        .provide([
          [select(getLoading), []],
          [select(getContracts), []],
          [select(getContract, { address: contractAddress }), contract],
          [call(VendorFactory.build, contract.vendor), vendor],
          [
            call([vendor.nftService, 'fetchOne'], contractAddress, tokenId, {
              rentalStatus: [RentalStatus.EXECUTED]
            }),
            Promise.resolve([nft, order, rental])
          ]
        ])
        .put(fetchNFTSuccess(nft, order, rental))
        .dispatch(
          fetchNFTRequest(contractAddress, tokenId, {
            rentalStatus: [RentalStatus.EXECUTED]
          })
        )
        .run({ silenceTimeout: true })
    })
  })
})

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
      const address = 'anAddress'
      const wallet = { address } as Wallet
      const vendor = VendorFactory.build(nft.vendor)
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
    let nft: NFT
    let address: string
    let wallet: Wallet
    let vendor: Vendor<VendorName.DECENTRALAND>
    let txHash: string
    beforeEach(() => {
      nft = {
        vendor: VendorName.DECENTRALAND
      } as NFT
      address = 'anAddress'
      wallet = { address } as Wallet
      vendor = VendorFactory.build(nft.vendor)
      txHash = 'someHash'
    })
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
        return expectSaga(nftSaga)
          .provide([
            [call(VendorFactory.build, nft.vendor), vendor],
            [select(getWallet), wallet],
            [select(getRentalById, nft.openRentalId!), rental],
            [
              call([vendor.nftService, 'transfer'], wallet, address, nft),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.resolve()],
            [
              call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED),
              Promise.resolve()
            ]
          ])
          .put(transferNFTSuccess(nft, address, txHash))
          .dispatch(transferNFTRequest(nft, address))
          .run({ silenceTimeout: true })
      })
    })

    describe('and it does not have a rental', () => {
      it('should dispatch an action signaling the success of the action handling', () => {
        return expectSaga(nftSaga)
          .provide([
            [call(VendorFactory.build, nft.vendor), vendor],
            [select(getWallet), wallet],
            [
              call([vendor.nftService, 'transfer'], wallet, address, nft),
              Promise.resolve(txHash)
            ],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(transferNFTSuccess(nft, address, txHash))
          .dispatch(transferNFTRequest(nft, address))
          .run({ silenceTimeout: true })
      })
    })
  })
})
