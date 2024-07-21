import { History } from 'history'
import { takeEvery, put, select, call, all, getContext } from 'redux-saga/effects'
import { Bid, RentalStatus, Trade, TradeCreation } from '@dcl/schemas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { isNFT } from '../asset/utils'
import { getContract } from '../contract/selectors'
import { getIsBidsOffChainEnabled } from '../features/selectors'
import { getCurrentNFT } from '../nft/selectors'
import { getRentalById } from '../rental/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'
import { locations } from '../routing/locations'
import { getBidPlacedSuccessToast } from '../toast/toasts'
import { BidService } from '../vendor/decentraland'
import { TradeService } from '../vendor/decentraland/TradeService'
import { VendorName } from '../vendor/types'
import { VendorFactory } from '../vendor/VendorFactory'
import { getWallet } from '../wallet/selectors'
import {
  PLACE_BID_REQUEST,
  PlaceBidRequestAction,
  placeBidFailure,
  placeBidSuccess,
  FETCH_BIDS_BY_ADDRESS_REQUEST,
  fetchBidsByAddressSuccess,
  fetchBidsByAddressFailure,
  FetchBidsByAddressRequestAction,
  ACCEPT_BID_REQUEST,
  CANCEL_BID_REQUEST,
  AcceptBidRequestAction,
  acceptBidSuccess,
  acceptBidFailure,
  CancelBidRequestAction,
  cancelBidSuccess,
  cancelBidFailure,
  FETCH_BIDS_BY_ASSET_REQUEST,
  FetchBidsByAssetRequestAction,
  fetchBidsByAssetSuccess,
  fetchBidsByAssetFailure,
  acceptBidtransactionSubmitted
} from './actions'
import * as bidUtils from './utils'

export function* bidSaga(bidService: BidService, tradeService: TradeService) {
  yield takeEvery(PLACE_BID_REQUEST, handlePlaceBidRequest)
  yield takeEvery(ACCEPT_BID_REQUEST, handleAcceptBidRequest)
  yield takeEvery(CANCEL_BID_REQUEST, handleCancelBidRequest)
  yield takeEvery(FETCH_BIDS_BY_ADDRESS_REQUEST, handleFetchBidsByAddressRequest)
  yield takeEvery(FETCH_BIDS_BY_ASSET_REQUEST, handleFetchBidsByAssetRequest)

  function* handlePlaceBidRequest(action: PlaceBidRequestAction) {
    const { asset, price, expiresAt, fingerprint } = action.payload
    try {
      const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
      if (!wallet) {
        throw new Error("Can't place a bid without a wallet")
      }

      const isBidsOffchainEnabled: boolean = yield select(getIsBidsOffChainEnabled)

      if (isBidsOffchainEnabled) {
        const history: History = yield getContext('history')
        const trade: TradeCreation = yield call([bidUtils, 'createBidTrade'], asset, price, expiresAt, fingerprint)
        yield call([tradeService, 'addTrade'], trade)
        yield put(placeBidSuccess(asset, price, expiresAt, asset.chainId, wallet.address, fingerprint))
        yield put(showToast(getBidPlacedSuccessToast(asset)))
        history.push(
          isNFT(asset) ? locations.nft(asset.contractAddress, asset.tokenId) : locations.item(asset.contractAddress, asset.itemId)
        )
      } else {
        if (isNFT(asset)) {
          const vendor = VendorFactory.build(asset.vendor)

          if (!vendor.bidService) {
            throw new Error("Couldn't find a valid bid service for vendor")
          }
          const txHash = (yield call([vendor.bidService, 'place'], wallet, asset, price, expiresAt, fingerprint)) as Awaited<
            ReturnType<typeof vendor.bidService.place>
          >
          yield put(placeBidSuccess(asset, price, expiresAt, asset.chainId, wallet.address, fingerprint, txHash))
        } else {
          throw new Error('Only NFTs are supported for bidding')
        }
      }
    } catch (error) {
      yield put(
        placeBidFailure(asset, price, expiresAt, isErrorWithMessage(error) ? error.message : t('global.unknown_error'), fingerprint)
      )
    }
  }

  function* handleAcceptBidRequest(action: AcceptBidRequestAction) {
    const { bid } = action.payload
    let txHash = ''
    try {
      const isBidsOffchainEnabled: boolean = yield select(getIsBidsOffChainEnabled)
      if (bidUtils.isBidTrade(bid)) {
        if (!isBidsOffchainEnabled) {
          throw new Error('not able to accept offchain bids')
        }

        const trade: Trade = yield call([tradeService, 'fetchTrade'], bid.tradeId)
        txHash = yield call([tradeService, 'accept'], trade)
      } else {
        const contract = (yield select(getContract, {
          address: bid.contractAddress
        })) as ReturnType<typeof getContract>
        if (!contract || !contract.vendor) {
          throw new Error(
            contract
              ? `Couldn't find a valid vendor for contract ${contract?.address}`
              : `Couldn't find a valid vendor for contract ${bid.contractAddress}`
          )
        }
        const vendor = (yield call([VendorFactory, 'build'], contract.vendor)) as ReturnType<typeof VendorFactory.build>
        if (!vendor.bidService) {
          throw new Error("Couldn't find a valid bid service for vendor")
        }

        const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
        txHash = (yield call([vendor.bidService, 'accept'], wallet, bid)) as Awaited<ReturnType<typeof vendor.bidService.accept>>
      }

      yield put(acceptBidtransactionSubmitted(bid, txHash))
      const nft = (yield select(getCurrentNFT)) as ReturnType<typeof getCurrentNFT>
      if (nft?.openRentalId) {
        yield call(waitForTx, txHash)
        const rental = (yield select(getRentalById, nft.openRentalId)) as ReturnType<typeof getRentalById>
        if (isRentalListingOpen(rental)) {
          yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
        }
      }

      yield put(acceptBidSuccess(bid))
    } catch (error) {
      yield put(acceptBidFailure(bid, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleCancelBidRequest(action: CancelBidRequestAction) {
    const { bid } = action.payload
    let txHash = ''
    try {
      const isBidsOffchainEnabled: boolean = yield select(getIsBidsOffChainEnabled)
      if (bidUtils.isBidTrade(bid)) {
        if (!isBidsOffchainEnabled) {
          throw new Error('not able to cancel offchain bids')
        }

        const trade: Trade = yield call([tradeService, 'fetchTrade'], bid.tradeId)
        txHash = yield call([tradeService, 'cancel'], trade)
      } else {
        const contract = (yield select(getContract, {
          address: bid.contractAddress
        })) as ReturnType<typeof getContract>

        if (!contract || !contract.vendor) {
          throw new Error(`Couldn't find a valid vendor for contract ${contract?.address}`)
        }
        const { bidService } = VendorFactory.build(contract.vendor)
        if (!bidService) {
          throw new Error("Couldn't find a valid bid service for vendor")
        }

        const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
        txHash = (yield call([bidService, 'cancel'], wallet, bid)) as Awaited<ReturnType<typeof bidService.cancel>>
      }

      yield put(cancelBidSuccess(bid, txHash))
    } catch (error) {
      yield put(cancelBidFailure(bid, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleFetchBidsByAddressRequest(action: FetchBidsByAddressRequestAction) {
    const { address } = action.payload
    try {
      let sellerBids: Bid[] = []
      let bidderBids: Bid[] = []

      const isBidsOffchainEnabled: boolean = yield select(getIsBidsOffChainEnabled)
      if (isBidsOffchainEnabled) {
        const bids = (yield all([
          call([bidService, 'fetchBids'], { seller: address }),
          call([bidService, 'fetchBids'], { bidder: address })
        ])) as [Awaited<ReturnType<typeof bidService.fetchBids>>, Awaited<ReturnType<typeof bidService.fetchBids>>]
        sellerBids = bids[0].results
        bidderBids = bids[1].results
      } else {
        for (const vendorName of Object.values(VendorName)) {
          const vendor = VendorFactory.build(vendorName)
          if (vendor.bidService === undefined) {
            continue
          }

          const bids = (yield all([
            call([vendor.bidService, 'fetchBySeller'], address),
            call([vendor.bidService, 'fetchByBidder'], address)
          ])) as [Awaited<ReturnType<typeof vendor.bidService.fetchBySeller>>, Awaited<ReturnType<typeof vendor.bidService.fetchByBidder>>]
          sellerBids = sellerBids.concat(bids[0])
          bidderBids = bidderBids.concat(bids[1])
        }
      }
      yield put(fetchBidsByAddressSuccess(address, sellerBids, bidderBids))
    } catch (error) {
      yield put(fetchBidsByAddressFailure(address, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }

  function* handleFetchBidsByAssetRequest(action: FetchBidsByAssetRequestAction) {
    const { asset } = action.payload
    let bids: Bid[] = []
    try {
      const isBidsOffchainEnabled: boolean = yield select(getIsBidsOffChainEnabled)
      if (isBidsOffchainEnabled) {
        const response: Awaited<ReturnType<typeof bidService.fetchBids>> = yield call([bidService, 'fetchBids'], {
          contractAddress: asset.contractAddress,
          ...(isNFT(asset) ? { tokenId: asset.tokenId } : { itemId: asset.itemId })
        })
        bids = response.results
      } else if (isNFT(asset)) {
        const { bidService } = VendorFactory.build(asset.vendor)
        if (!bidService) {
          throw new Error("Couldn't find a valid bid service for vendor")
        }

        bids = (yield call([bidService, 'fetchByNFT'], asset)) as Awaited<ReturnType<typeof bidService.fetchByNFT>>
      }

      yield put(fetchBidsByAssetSuccess(asset, bids))
    } catch (error) {
      yield put(fetchBidsByAssetFailure(asset, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
    }
  }
}
