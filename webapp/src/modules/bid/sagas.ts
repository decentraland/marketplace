import { Bid, RentalListing, RentalStatus } from '@dcl/schemas'
import { takeEvery, put, select, call } from 'redux-saga/effects'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { isErrorWithMessage } from '../../lib/error'
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
  FETCH_BIDS_BY_NFT_REQUEST,
  FetchBidsByNFTRequestAction,
  fetchBidsByNFTSuccess,
  fetchBidsByNFTFailure,
  acceptBidtransactionSubmitted
} from './actions'
import { getWallet } from '../wallet/selectors'
import { Vendor, VendorFactory } from '../vendor/VendorFactory'
import { getContract } from '../contract/selectors'
import { VendorName } from '../vendor/types'
import { getRentalById } from '../rental/selectors'
import { NFT } from '../nft/types'
import { getCurrentNFT } from '../nft/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'

export function* bidSaga() {
  yield takeEvery(PLACE_BID_REQUEST, handlePlaceBidRequest)
  yield takeEvery(ACCEPT_BID_REQUEST, handleAcceptBidRequest)
  yield takeEvery(CANCEL_BID_REQUEST, handleCancelBidRequest)
  yield takeEvery(FETCH_BIDS_BY_ADDRESS_REQUEST, handleFetchBidsByAddressRequest)
  yield takeEvery(FETCH_BIDS_BY_NFT_REQUEST, handleFetchBidsByNFTRequest)
}

function* handlePlaceBidRequest(action: PlaceBidRequestAction) {
  const { nft, price, expiresAt, fingerprint } = action.payload
  try {
    const { bidService } = VendorFactory.build(nft.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(() => bidService!.place(wallet, nft, price, expiresAt, fingerprint))
    yield put(placeBidSuccess(nft, price, expiresAt, nft.chainId, txHash, wallet!.address, fingerprint))
  } catch (error) {
    yield put(placeBidFailure(nft, price, expiresAt, isErrorWithMessage(error) ? error.message : t('global.unknown_error'), fingerprint))
  }
}

function* handleAcceptBidRequest(action: AcceptBidRequestAction) {
  const { bid } = action.payload
  try {
    const contract: ReturnType<typeof getContract> = yield select(getContract, {
      address: bid.contractAddress
    })
    if (!contract || !contract.vendor) {
      throw new Error(
        contract
          ? `Couldn't find a valid vendor for contract ${contract?.address}`
          : `Couldn't find a valid vendor for contract ${bid.contractAddress}`
      )
    }
    const vendor: Vendor<VendorName> = yield call([VendorFactory, 'build'], contract.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call([vendor.bidService!, 'accept'], wallet, bid)
    yield put(acceptBidtransactionSubmitted(bid, txHash))
    const nft: NFT | null = yield select(getCurrentNFT)
    if (nft?.openRentalId) {
      yield call(waitForTx, txHash)
      const rental: RentalListing | null = yield select(getRentalById, nft.openRentalId)
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
  try {
    const contract: ReturnType<typeof getContract> = yield select(getContract, {
      address: bid.contractAddress
    })
    if (!contract || !contract.vendor) {
      throw new Error(`Couldn't find a valid vendor for contract ${contract?.address}`)
    }
    const { bidService } = VendorFactory.build(contract.vendor)

    const wallet: ReturnType<typeof getWallet> = yield select(getWallet)
    const txHash: string = yield call(() => bidService!.cancel(wallet, bid))

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

    for (const vendorName of Object.values(VendorName)) {
      const { bidService } = VendorFactory.build(vendorName)
      if (bidService === undefined) {
        continue
      }

      const bids: [Bid[], Bid[]] = yield call(() => Promise.all([bidService.fetchBySeller(address), bidService.fetchByBidder(address)]))
      sellerBids = sellerBids.concat(bids[0])
      bidderBids = bidderBids.concat(bids[1])
    }

    yield put(fetchBidsByAddressSuccess(address, sellerBids, bidderBids))
  } catch (error) {
    yield put(fetchBidsByAddressFailure(address, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}

function* handleFetchBidsByNFTRequest(action: FetchBidsByNFTRequestAction) {
  const { nft } = action.payload
  try {
    const { bidService } = VendorFactory.build(nft.vendor)

    const bids: Bid[] = yield call(() => bidService!.fetchByNFT(nft))

    yield put(fetchBidsByNFTSuccess(nft, bids))
  } catch (error) {
    yield put(fetchBidsByNFTFailure(nft, isErrorWithMessage(error) ? error.message : t('global.unknown_error')))
  }
}
