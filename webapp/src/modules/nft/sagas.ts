import { takeEvery, call, put, select } from 'redux-saga/effects'
import { RentalStatus } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal'
import { waitForTx } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CONNECT_WALLET_SUCCESS, ConnectWalletSuccessAction } from 'decentraland-dapps/dist/modules/wallet'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ErrorCode } from 'decentraland-transactions'
import { isErrorWithMessage } from '../../lib/error'
import { isLegacyOrder } from '../../lib/orders'
import { fetchSmartWearableRequiredPermissionsRequest } from '../asset/actions'
import { upsertContracts } from '../contract/actions'
import { getContract, getContracts } from '../contract/selectors'
import { getContractKey, getContractKeyFromNFT, getStubMaticCollectionContract } from '../contract/utils'
import { getRentalById } from '../rental/selectors'
import { isRentalListingOpen, waitUntilRentalChangesStatus } from '../rental/utils'
import { AwaitFn } from '../types'
import { getView } from '../ui/browse/selectors'
import { View } from '../ui/types'
import { EXPIRED_LISTINGS_MODAL_KEY } from '../ui/utils'
import { MAX_QUERY_SIZE } from '../vendor/api'
import { retryParams } from '../vendor/decentraland/utils'
import { Contract } from '../vendor/services'
import { VendorName } from '../vendor/types'
import { VendorFactory } from '../vendor/VendorFactory'
import { getWallet } from '../wallet/selectors'
import {
  DEFAULT_BASE_NFT_PARAMS,
  FETCH_NFTS_REQUEST,
  FetchNFTsRequestAction,
  fetchNFTsSuccess,
  fetchNFTsFailure,
  FETCH_NFT_REQUEST,
  FetchNFTRequestAction,
  fetchNFTSuccess,
  fetchNFTFailure,
  TRANSFER_NFT_REQUEST,
  TransferNFTRequestAction,
  transferNFTSuccess,
  transferNFTFailure,
  transferNFTransactionSubmitted
} from './actions'
import { NFT } from './types'

export function* nftSaga(getIdentity: () => AuthIdentity | undefined) {
  const API_OPTS = {
    retries: retryParams.attempts,
    retryDelay: retryParams.delay,
    identity: getIdentity
  }

  yield takeEvery(FETCH_NFTS_REQUEST, handleFetchNFTsRequest)
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
  yield takeEvery(TRANSFER_NFT_REQUEST, handleTransferNFTRequest)
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)

  function* handleConnectWalletSuccess(action: ConnectWalletSuccessAction) {
    const {
      payload: {
        wallet: { address }
      }
    } = action
    const view = (yield select(getView)) as ReturnType<typeof getView>
    const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
    const hasShownTheExpiredListingsModalBefore = (yield call([localStorage, 'getItem'], EXPIRED_LISTINGS_MODAL_KEY)) as ReturnType<
      typeof localStorage.getItem
    >

    if (hasShownTheExpiredListingsModalBefore !== 'true') {
      const vendor = (yield call([VendorFactory, 'build'], VendorName.DECENTRALAND, API_OPTS)) as ReturnType<typeof VendorFactory.build>
      const [, , orders] = (yield call(
        [vendor.nftService, 'fetch'],
        {
          first: MAX_QUERY_SIZE,
          skip: 0,
          onlyOnSale: true,
          address
        },
        {}
      )) as Awaited<ReturnType<typeof vendor.nftService.fetch>>
      if (wallet && view !== View.CURRENT_ACCOUNT) {
        if (orders.some(order => isLegacyOrder(order) && order.owner === wallet.address)) {
          yield put(openModal('ExpiredListingsModal'))
        }
      }
    }
  }

  function* handleFetchNFTsRequest(action: FetchNFTsRequestAction) {
    const { options, timestamp } = action.payload
    const { vendor: vendorName, filters } = options

    const params = {
      ...DEFAULT_BASE_NFT_PARAMS,
      ...action.payload.options.params
    }

    try {
      const vendor = (yield call([VendorFactory, 'build'], vendorName, API_OPTS)) as ReturnType<typeof VendorFactory.build>

      const [nfts, accounts, orders, rentals, count] = (yield call([vendor.nftService, 'fetch'], params, filters)) as Awaited<
        ReturnType<typeof vendor.nftService.fetch>
      >

      const contracts = (yield select(getContracts)) as ReturnType<typeof getContracts>

      const contractKeys = new Set(contracts.map(getContractKey))

      // From the obtained nfts, it will check if there are contracts stored for each of them.
      // Any nft that doesn't have a matching contract will have a stub one created and stored
      // So it can be used on the rest of the application.
      // Only wearables and emotes will have a stub contract created.
      const newContracts = nfts.reduce((arr, nft) => {
        const contractKeyFromNFT = getContractKeyFromNFT(nft)

        if (!contractKeys.has(contractKeyFromNFT)) {
          arr.push(getStubMaticCollectionContract(nft.contractAddress))
        }

        return arr
      }, [] as Contract[])

      if (newContracts.length > 0) {
        yield put(upsertContracts(newContracts))
      }

      yield put(fetchNFTsSuccess(options, nfts as NFT[], accounts, orders, rentals, count, timestamp))
    } catch (error) {
      yield put(fetchNFTsFailure(options, (error as Error).message, timestamp))
    }
  }
  function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
    const { contractAddress, tokenId, options } = action.payload

    try {
      let contract = (yield select(getContract, {
        address: contractAddress.toLowerCase()
      })) as ReturnType<typeof getContract>

      // If the contract is not present in the state, it means that it is a wearable/emote.
      // In this case, a stub contract is created and added to the state so it can be used
      // on the rest of the application.
      if (!contract) {
        contract = getStubMaticCollectionContract(contractAddress)

        yield put(upsertContracts([contract]))
      }

      if (!contract.vendor) {
        throw new Error(`Couldn't find a valid vendor for contract ${contract?.address}`)
      }

      const vendor = (yield call([VendorFactory, 'build'], contract.vendor, API_OPTS)) as ReturnType<typeof VendorFactory.build>

      const [nft, order, rental] = (yield call([vendor.nftService, 'fetchOne'], contractAddress, tokenId, options)) as AwaitFn<
        typeof vendor.nftService.fetchOne
      >

      yield put(fetchNFTSuccess(nft as NFT, order, rental))
      if (nft.data?.wearable?.isSmart && nft.urn) {
        yield put(fetchSmartWearableRequiredPermissionsRequest(nft as NFT))
      }
    } catch (error) {
      yield put(fetchNFTFailure(contractAddress, tokenId, (error as Error).message))
    }
  }

  function* handleTransferNFTRequest(action: TransferNFTRequestAction) {
    const { nft, address } = action.payload
    try {
      const vendor = (yield call([VendorFactory, 'build'], nft.vendor)) as ReturnType<typeof VendorFactory.build>

      const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
      if (!wallet) {
        throw new Error('A wallet is needed to perform a NFT transfer request')
      }

      const txHash = (yield call([vendor.nftService, 'transfer'], wallet, address, nft)) as Awaited<
        ReturnType<typeof vendor.nftService.transfer>
      >
      yield put(transferNFTransactionSubmitted(nft, address, txHash))
      if (nft?.openRentalId) {
        yield call(waitForTx, txHash)
        const rental = (yield select(getRentalById, nft.openRentalId)) as ReturnType<typeof getRentalById>
        if (isRentalListingOpen(rental)) {
          yield call(waitUntilRentalChangesStatus, nft, RentalStatus.CANCELLED)
        }
      }

      yield put(transferNFTSuccess(nft, address))
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      const errorCode =
        error !== undefined && error !== null && typeof error === 'object' && 'code' in error
          ? (error as { code: ErrorCode }).code
          : undefined
      yield put(transferNFTFailure(nft, address, errorMessage, errorCode))
    }
  }
}
