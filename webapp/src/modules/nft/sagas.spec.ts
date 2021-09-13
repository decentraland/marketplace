import { push } from 'connected-react-router'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { throwError } from 'redux-saga-test-plan/providers'
import * as matchers from 'redux-saga-test-plan/matchers'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorFactory, VendorName } from '../vendor'
import { getWallet } from '../wallet/selectors'
import { locations } from '../routing/locations'
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
import { Order } from '../order/types'
import { getContract } from '../contract/utils'
import { NFTCategory } from '@dcl/schemas'

describe('when handling the fetch NFTs requets action', () => {
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
      const count = 1

      return expectSaga(nftSaga)
        .provide([
          [call(VendorFactory.build, options.vendor), vendor],
          [
            call(vendor.nftService.fetch, options.params, options.filters),
            [nfts, accounts, orders, count]
          ],
          [
            call(
              [vendor.nftService, 'fetch'],
              { ...DEFAULT_BASE_NFT_PARAMS, ...options.params },
              options.filters
            ),
            [nfts, accounts, orders, count]
          ]
        ])
        .put(
          fetchNFTsSuccess(options, nfts, accounts, orders, count, timestamp)
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
          [
            call(getContract, { address: contractAddress }),
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
        .provide([[call(getContract, { address: contractAddress }), contract]])
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
          [call(getContract, { address: contractAddress }), contract],
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
          [call(getContract, { address: contractAddress }), contract],
          [call(VendorFactory.build, contract.vendor), vendor],
          [
            call([vendor.nftService, 'fetchOne'], contractAddress, tokenId),
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

      return expectSaga(nftSaga)
        .provide([
          [call(getContract, { address: contractAddress }), contract],
          [call(VendorFactory.build, contract.vendor), vendor],
          [
            call([vendor.nftService, 'fetchOne'], contractAddress, tokenId),
            Promise.resolve([nft, order])
          ]
        ])
        .put(fetchNFTSuccess(nft, order))
        .dispatch(fetchNFTRequest(contractAddress, tokenId))
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
    it('should dispatch an action signaling the success of the action handling and the change of the location', () => {
      const nft = {
        vendor: VendorName.DECENTRALAND
      } as NFT
      const address = 'anAddress'
      const wallet = { address } as Wallet
      const vendor = VendorFactory.build(nft.vendor)
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
