import { call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { Bid, ChainId, Network, RentalListing, RentalStatus, TradeAssetType, TradeCreation, TradeType, Trade } from '@dcl/schemas'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../asset/types'
import { getContract } from '../contract/selectors'
import { getIsBidsOffChainEnabled } from '../features/selectors'
import { getCurrentNFT } from '../nft/selectors'
import { NFT } from '../nft/types'
import { getRentalById } from '../rental/selectors'
import { waitUntilRentalChangesStatus } from '../rental/utils'
import { Vendor, VendorFactory, VendorName } from '../vendor'
import { BidService } from '../vendor/decentraland'
import { TradeService } from '../vendor/decentraland/TradeService'
import { Contract } from '../vendor/services'
import { getWallet } from '../wallet/selectors'
import {
  acceptBidFailure,
  acceptBidtransactionSubmitted,
  acceptBidRequest,
  acceptBidSuccess,
  placeBidRequest,
  placeBidSuccess,
  placeBidFailure,
  fetchBidsByAssetRequest,
  fetchBidsByAssetSuccess,
  fetchBidsByAssetFailure,
  cancelBidFailure,
  cancelBidRequest,
  cancelBidSuccess
} from './actions'
import { bidSaga } from './sagas'
import * as bidUtils from './utils'

let bidService: BidService
let tradeService: TradeService

beforeEach(() => {
  bidService = new BidService()
  tradeService = new TradeService(() => undefined)
})

describe('when handling the creation of a bid', () => {
  let wallet: Wallet
  let asset: Asset
  let price: number
  let expiration: number
  let fingerprint: string

  beforeEach(() => {
    wallet = { address: '0x123' } as Wallet
    asset = { tokenId: 'token-id' } as Asset
    price = 1
    expiration = 123123
    fingerprint = 'fingerprint'
  })

  describe('and offchain bids are enabled', () => {
    let trade: TradeCreation
    let tradeServiceMock: TradeService

    describe('and the asset is an item', () => {
      beforeEach(() => {
        asset = { itemId: 'item-id', chainId: ChainId.ETHEREUM_SEPOLIA } as Asset
        trade = {
          signer: wallet.address,
          signature: 'signature',
          type: TradeType.BID,
          network: Network.ETHEREUM,
          chainId: ChainId.ETHEREUM_SEPOLIA,
          checks: {
            expiration: Date.now() + 100000000000,
            effective: Date.now(),
            uses: 1,
            salt: '',
            allowedRoot: '0x',
            contractSignatureIndex: 0,
            externalChecks: [],
            signerSignatureIndex: 0
          },
          sent: [
            {
              assetType: TradeAssetType.ERC20,
              contractAddress: '0x123',
              amount: '2',
              extra: ''
            }
          ],
          received: [
            {
              assetType: TradeAssetType.ERC721,
              contractAddress: '0x1234',
              tokenId: '1',
              extra: '',
              beneficiary: wallet.address
            }
          ]
        }
      })

      describe('and the trade creation finish successfully', () => {
        beforeEach(() => {
          tradeServiceMock = { addTrade: jest.fn().mockResolvedValue(trade) } as unknown as TradeService
        })

        it('should dispatch bid success action', () => {
          return expectSaga(bidSaga, bidService, tradeServiceMock)
            .provide([
              [select(getWallet), wallet],
              [call([bidUtils, 'createBidTrade'], asset, price, expiration, fingerprint), trade],
              [select(getIsBidsOffChainEnabled), true]
            ])
            .put(placeBidSuccess(asset, price, expiration, asset.chainId, wallet.address, fingerprint))
            .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
            .run()
        })
      })

      describe('and the trade creation throws an error', () => {
        let error: string

        beforeEach(() => {
          error = 'Some error'
          tradeServiceMock = { addTrade: jest.fn().mockRejectedValue(new Error(error)) } as unknown as TradeService
        })

        it('should dispatch bid failure action', () => {
          return expectSaga(bidSaga, bidService, tradeServiceMock)
            .provide([
              [select(getWallet), wallet],
              [call([bidUtils, 'createBidTrade'], asset, price, expiration, fingerprint), trade],
              [select(getIsBidsOffChainEnabled), true]
            ])
            .put(placeBidFailure(asset, price, expiration, error, fingerprint))
            .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
            .run()
        })
      })
    })

    describe('and the asset is an nft', () => {
      beforeEach(() => {
        asset = { tokenId: 'token-id', chainId: ChainId.ETHEREUM_SEPOLIA, vendor: VendorName.DECENTRALAND } as Asset
      })

      describe('and the trade creation finish successfully', () => {
        beforeEach(() => {
          tradeServiceMock = { addTrade: jest.fn().mockResolvedValue(trade) } as unknown as TradeService
        })

        it('should dispatch bid success action', () => {
          return expectSaga(bidSaga, bidService, tradeServiceMock)
            .provide([
              [select(getWallet), wallet],
              [call([bidUtils, 'createBidTrade'], asset, price, expiration, fingerprint), trade],
              [select(getIsBidsOffChainEnabled), true]
            ])
            .put(placeBidSuccess(asset, price, expiration, asset.chainId, wallet.address, fingerprint))
            .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
            .run()
        })
      })

      describe('and the trade creation throws an error', () => {
        let error: string
        beforeEach(() => {
          error = 'Some error'
          tradeServiceMock = { addTrade: jest.fn().mockRejectedValue(new Error(error)) } as unknown as TradeService
        })

        it('should dispatch bid failure action', () => {
          return expectSaga(bidSaga, bidService, tradeServiceMock)
            .provide([
              [select(getWallet), wallet],
              [call([bidUtils, 'createBidTrade'], asset, price, expiration, fingerprint), trade],
              [select(getIsBidsOffChainEnabled), true]
            ])
            .put(placeBidFailure(asset, price, expiration, error, fingerprint))
            .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
            .run()
        })
      })
    })
  })

  describe('and offchain bids are not enabled', () => {
    let tx: string

    describe('and the asset is an item', () => {
      beforeEach(() => {
        asset = { itemId: 'item-id', chainId: ChainId.ETHEREUM_SEPOLIA } as Asset
      })

      it('should dispatch bid failure action', () => {
        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getWallet), wallet],
            [select(getIsBidsOffChainEnabled), false]
          ])
          .put(placeBidFailure(asset, price, expiration, 'Only NFTs are supported for bidding', fingerprint))
          .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
          .run()
      })
    })

    describe('and the asset is an nft', () => {
      beforeEach(() => {
        asset = { tokenId: 'token-id', chainId: ChainId.ETHEREUM_SEPOLIA, vendor: VendorName.DECENTRALAND } as Asset
        tx = 'tx-hash'
      })

      it('should send bid transaction', () => {
        const vendor = VendorFactory.build((asset as NFT).vendor)

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [call([VendorFactory, 'build'], (asset as NFT).vendor), vendor],
            [select(getWallet), wallet],
            [select(getIsBidsOffChainEnabled), false],
            [call([vendor.bidService!, 'place'], wallet, asset as NFT, price, expiration, fingerprint), Promise.resolve(tx)]
          ])
          .put(placeBidSuccess(asset, price, expiration, asset.chainId, wallet.address, fingerprint, tx))
          .dispatch(placeBidRequest(asset, price, expiration, fingerprint))
          .run()
      })
    })
  })
})

describe('when handling the accepting a bid action', () => {
  let wallet: Wallet
  let address: string
  beforeEach(() => {
    address = 'anAddress'
    wallet = { address } as Wallet
  })

  describe('and offchain bids are not enabled', () => {
    describe('and getting the contract fails', () => {
      it('should dispatch an action signaling the failure of the action handling', () => {
        const bid = {
          contractAddress: '0x123'
        } as Bid

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), undefined],
            [select(getIsBidsOffChainEnabled), false]
          ])
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

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), contract],
            [select(getIsBidsOffChainEnabled), false],
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

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), contract],
            [select(getIsBidsOffChainEnabled), false],
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
            return expectSaga(bidSaga, bidService, tradeService)
              .provide([
                [select(getIsBidsOffChainEnabled), false],
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
            return expectSaga(bidSaga, bidService, tradeService)
              .provide([
                [select(getIsBidsOffChainEnabled), false],
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
          return expectSaga(bidSaga, bidService, tradeService)
            .provide([
              [select(getIsBidsOffChainEnabled), false],
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

  describe('and offchain bids are enabled', () => {
    let tradeServiceMock: jest.Mocked<TradeService>
    let bid: Bid

    describe('and getting the trade by id fails', () => {
      let error: string

      beforeEach(() => {
        error = 'Some error'
        bid = {
          contractAddress: '0x123',
          tradeId: 'atrade-id'
        } as Bid
        tradeServiceMock = { fetchTrade: jest.fn().mockRejectedValue(new Error(error)) } as unknown as jest.Mocked<TradeService>
      })

      it('should dispatch an action signaling the failure of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeServiceMock)
          .provide([[select(getIsBidsOffChainEnabled), true]])
          .put(acceptBidFailure(bid, error))
          .dispatch(acceptBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the trade acceptance transaction was sent successfully', () => {
      let trade: Trade
      let txHash: string

      beforeEach(() => {
        trade = {
          id: 'atrade-id',
          signer: '0x123',
          signature: '0x123123',
          type: TradeType.BID,
          network: Network.ETHEREUM,
          chainId: ChainId.ETHEREUM_SEPOLIA,
          createdAt: Date.now(),
          checks: {
            expiration: Date.now() + 100000000000,
            effective: Date.now(),
            uses: 1,
            salt: '',
            allowedRoot: '0x',
            contractSignatureIndex: 0,
            externalChecks: [],
            signerSignatureIndex: 0
          },
          sent: [
            {
              assetType: TradeAssetType.ERC20,
              contractAddress: '0x1231',
              amount: '2',
              extra: ''
            }
          ],
          received: [
            {
              assetType: TradeAssetType.ERC721,
              contractAddress: '0x12321',
              tokenId: '1',
              extra: '',
              beneficiary: '0x123'
            }
          ]
        }

        bid = {
          contractAddress: '0x123',
          tradeId: 'atrade-id',
          price: '123'
        } as Bid

        txHash = '0x12312412'

        tradeServiceMock = {
          fetchTrade: jest.fn().mockResolvedValue(trade),
          accept: jest.fn().mockResolvedValue(txHash)
        } as unknown as jest.Mocked<TradeService>
      })

      it('should dispatch an action signaling the success of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeServiceMock)
          .provide([
            [select(getIsBidsOffChainEnabled), true],
            [select(getCurrentNFT), null],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(acceptBidSuccess(bid))
          .dispatch(acceptBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })
  })
})

describe('when handling the fetching of bids by asset', () => {
  let asset: Asset
  let bids: Bid[]
  let bidServiceMock: jest.Mocked<BidService>

  beforeEach(() => {
    asset = { tokenId: 'token-id' } as Asset
    bids = [{ id: '1', bidAddress: '0x123' } as Bid]
    bidServiceMock = { fetchBids: jest.fn().mockResolvedValue({ results: bids }) } as unknown as jest.Mocked<BidService>
  })

  describe('and offchain bids are enabled', () => {
    describe('and the fetching of bids by asset is successful', () => {
      beforeEach(() => {
        bidServiceMock = { fetchBids: jest.fn().mockResolvedValue({ results: bids }) } as unknown as jest.Mocked<BidService>
      })

      it('should dispatch an action signaling the success of the action handling', () => {
        return expectSaga(bidSaga, bidServiceMock, tradeService)
          .provide([[select(getIsBidsOffChainEnabled), true]])
          .put(fetchBidsByAssetSuccess(asset, bids))
          .dispatch(fetchBidsByAssetRequest(asset))
          .run()
      })
    })

    describe('and the fetching of bids by asset fails', () => {
      let error: Error

      beforeEach(() => {
        error = new Error('Some error')
        bidServiceMock = { fetchBids: jest.fn().mockRejectedValue(error) } as unknown as jest.Mocked<BidService>
      })

      it('should dispatch an action signaling the failure of the action handling', () => {
        return expectSaga(bidSaga, bidServiceMock, tradeService)
          .provide([[select(getIsBidsOffChainEnabled), true]])
          .put(fetchBidsByAssetFailure(asset, error.message))
          .dispatch(fetchBidsByAssetRequest(asset))
          .run()
      })
    })
  })

  describe('and offchain bids are not enabled', () => {
    let asset: NFT
    let contract: Contract
    let vendor: Vendor<VendorName.DECENTRALAND>

    beforeEach(() => {
      asset = {
        vendor: VendorName.DECENTRALAND,
        tokenId: 'token-id'
      } as NFT
      contract = {
        vendor: VendorName.DECENTRALAND
      } as Contract
      vendor = VendorFactory.build(contract.vendor!)
    })

    describe('and the fetching of bids by asset is successful', () => {
      it('should dispatch an action signaling the success of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getIsBidsOffChainEnabled), false],
            [call([VendorFactory, 'build'], asset.vendor), vendor],
            [call([vendor.bidService!, 'fetchByNFT'], asset), Promise.resolve(bids)]
          ])
          .put(fetchBidsByAssetSuccess(asset, bids))
          .dispatch(fetchBidsByAssetRequest(asset))
          .run()
      })
    })

    describe('and the fetching of bids by asset fails', () => {
      let error: Error

      beforeEach(() => {
        error = new Error('Some error')
      })

      it('should dispatch an action signaling the failure of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getIsBidsOffChainEnabled), false],
            [call([VendorFactory, 'build'], asset.vendor), vendor],
            [call([vendor.bidService!, 'fetchByNFT'], asset), Promise.reject(error)]
          ])
          .put(fetchBidsByAssetFailure(asset, error.message))
          .dispatch(fetchBidsByAssetRequest(asset))
          .run()
      })
    })
  })
})
describe('when handling the cancellation of a bid action', () => {
  let wallet: Wallet
  let address: string
  beforeEach(() => {
    address = 'anAddress'
    wallet = { address } as Wallet
  })

  describe('and offchain bids are not enabled', () => {
    describe('and getting the contract fails', () => {
      it('should dispatch an action signaling the failure of the action handling', () => {
        const bid = {
          contractAddress: '0x123'
        } as Bid

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), { address: bid.contractAddress }],
            [select(getIsBidsOffChainEnabled), false]
          ])
          .put(cancelBidFailure(bid, `Couldn't find a valid vendor for contract ${bid.contractAddress}`))
          .dispatch(cancelBidRequest(bid))
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
        const error = `Invalid vendor "${contract.vendor}"`
        const bid = {
          contractAddress: contract.address
        } as Bid

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), contract],
            [select(getIsBidsOffChainEnabled), false],
            [select(getWallet), wallet],
            [call([VendorFactory, 'build'], contract.vendor), throwError(new Error(error))]
          ])
          .put(cancelBidFailure(bid, error))
          .dispatch(cancelBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })

    describe('when canceling the bid request fails', () => {
      it('should dispatch an action signaling the failure of the action handling', () => {
        const bid = {
          contractAddress: '0x123'
        } as Bid
        const error = { message: 'anError' }
        const contract = {
          vendor: VendorName.DECENTRALAND
        }
        const vendor = VendorFactory.build(contract.vendor)

        return expectSaga(bidSaga, bidService, tradeService)
          .provide([
            [select(getContract, { address: bid.contractAddress }), contract],
            [select(getIsBidsOffChainEnabled), false],
            [call([VendorFactory, 'build'], contract.vendor), vendor],
            [select(getWallet), wallet],
            [call([vendor.bidService!, 'cancel'], wallet, bid), Promise.reject(error)]
          ])
          .put(cancelBidFailure(bid, error.message))
          .dispatch(cancelBidRequest(bid))
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

      describe('and the transaction finishes successfully', () => {
        it('should dispatch an action signaling the success of the action handling', () => {
          return expectSaga(bidSaga, bidService, tradeService)
            .provide([
              [select(getIsBidsOffChainEnabled), false],
              [select(getContract, { address: bid.contractAddress }), contract],
              [call([VendorFactory, 'build'], contract.vendor!), vendor],
              [select(getWallet), wallet],
              [select(getCurrentNFT), nft],
              [call([vendor.bidService!, 'cancel'], wallet, bid), Promise.resolve(txHash)],
              [call(waitForTx, txHash), Promise.resolve()]
            ])
            .put(cancelBidSuccess(bid, txHash))
            .dispatch(cancelBidRequest(bid))
            .run({ silenceTimeout: true })
        })
      })
    })
  })

  describe('and offchain bids are enabled', () => {
    let tradeServiceMock: jest.Mocked<TradeService>
    let bid: Bid

    describe('and getting the trade by id fails', () => {
      let error: string

      beforeEach(() => {
        error = 'Some error'
        bid = {
          contractAddress: '0x123',
          tradeId: 'atrade-id'
        } as Bid
        tradeServiceMock = { fetchTrade: jest.fn().mockRejectedValue(new Error(error)) } as unknown as jest.Mocked<TradeService>
      })

      it('should dispatch an action signaling the failure of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeServiceMock)
          .provide([[select(getIsBidsOffChainEnabled), true]])
          .put(acceptBidFailure(bid, error))
          .dispatch(acceptBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the trade cancel transaction was sent successfully', () => {
      let trade: Trade
      let txHash: string

      beforeEach(() => {
        trade = {
          id: 'atrade-id',
          signer: '0x123',
          signature: '0x123123',
          type: TradeType.BID,
          network: Network.ETHEREUM,
          chainId: ChainId.ETHEREUM_SEPOLIA,
          createdAt: Date.now(),
          checks: {
            expiration: Date.now() + 100000000000,
            effective: Date.now(),
            uses: 1,
            salt: '',
            allowedRoot: '0x',
            contractSignatureIndex: 0,
            externalChecks: [],
            signerSignatureIndex: 0
          },
          sent: [
            {
              assetType: TradeAssetType.ERC20,
              contractAddress: '0x1231',
              amount: '2',
              extra: ''
            }
          ],
          received: [
            {
              assetType: TradeAssetType.ERC721,
              contractAddress: '0x12321',
              tokenId: '1',
              extra: '',
              beneficiary: '0x123'
            }
          ]
        }

        bid = {
          contractAddress: '0x123',
          tradeId: 'atrade-id',
          price: '123'
        } as Bid

        txHash = '0x12312412'

        tradeServiceMock = {
          fetchTrade: jest.fn().mockResolvedValue(trade),
          cancel: jest.fn().mockResolvedValue(txHash)
        } as unknown as jest.Mocked<TradeService>
      })

      it('should dispatch an action signaling the success of the action handling', () => {
        return expectSaga(bidSaga, bidService, tradeServiceMock)
          .provide([
            [select(getIsBidsOffChainEnabled), true],
            [select(getCurrentNFT), null],
            [call(waitForTx, txHash), Promise.resolve()]
          ])
          .put(cancelBidSuccess(bid, txHash))
          .dispatch(cancelBidRequest(bid))
          .run({ silenceTimeout: true })
      })
    })
  })
})
