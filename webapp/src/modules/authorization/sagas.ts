import { Eth, SendTx } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { all, put, call, select, takeEvery } from 'redux-saga/effects'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

import { ERC20, ERC20TransactionReceipt } from '../../contracts/ERC20'
import { ERC721, ERC721TransactionReceipt } from '../../contracts/ERC721'
import { getWallet } from '../wallet/selectors'
import { AwaitFn } from '../types'
import {
  getAuthorizations,
  callAllowance,
  callIsApprovedForAll,
  getTokenAmountToApprove
} from './utils'
import {
  FetchAuthorizationRequestAction,
  AllowTokenRequestAction,
  ApproveTokenRequestAction,
  FETCH_AUTHORIZATION_REQUEST,
  ALLOW_TOKEN_REQUEST,
  APPROVE_TOKEN_REQUEST,
  fetchAuthorizationSuccess,
  fetchAuthorizationFailure,
  allowTokenSuccess,
  allowTokenFailure,
  approveTokenSuccess,
  approveTokenFailure
} from './actions'

export function* authorizationSaga() {
  yield takeEvery(FETCH_AUTHORIZATION_REQUEST, handleFetchAuthorizationRequest)
  yield takeEvery(ALLOW_TOKEN_REQUEST, handleAllowTokenRequest)
  yield takeEvery(APPROVE_TOKEN_REQUEST, handleApproveTokenRequest)
}

function* handleFetchAuthorizationRequest(
  action: FetchAuthorizationRequestAction
) {
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }

    const payload = action.payload
    const address = payload.address.toLowerCase()

    const [allowances, approvals]: AwaitFn<
      typeof getAuthorizations
    >[] = yield all([
      getAuthorizations(
        payload.allowances,
        (tokenContractAddress: string, contractAddress: string) =>
          callAllowance(
            eth,
            tokenContractAddress,
            contractAddress,
            address
          ).then(allowance => allowance > 0)
      ),
      getAuthorizations(
        payload.approvals,
        (tokenContractAddress: string, contractAddress: string) =>
          callIsApprovedForAll(
            eth,
            tokenContractAddress,
            contractAddress,
            address
          )
      )
    ])

    const authorization = { allowances, approvals }

    yield put(fetchAuthorizationSuccess(address, authorization))
  } catch (error) {
    yield put(fetchAuthorizationFailure(error.message))
  }
}

function* handleAllowTokenRequest(action: AllowTokenRequestAction) {
  try {
    const { isAllowed, contractAddress, tokenContractAddress } = action.payload

    const eth = Eth.fromCurrentProvider()
    const wallet: Wallet | null = yield select(getWallet)

    if (!eth || !wallet) {
      throw new Error('Could not connect to Ethereum')
    }

    const { address } = wallet
    const amount = isAllowed ? getTokenAmountToApprove() : 0

    const tokenContract = new ERC20(
      eth,
      Address.fromString(tokenContractAddress)
    )
    const transaction: SendTx<ERC20TransactionReceipt> = yield call(() =>
      tokenContract.methods
        .approve(Address.fromString(contractAddress), amount)
        .send({ from: Address.fromString(address) })
    )
    const transactionHash: string = yield call(() => transaction.getTxHash())

    yield put(
      allowTokenSuccess(
        transactionHash,
        address,
        isAllowed,
        contractAddress,
        tokenContractAddress
      )
    )
  } catch (error) {
    yield put(allowTokenFailure(error.message))
  }
}

function* handleApproveTokenRequest(action: ApproveTokenRequestAction) {
  try {
    const { isApproved, contractAddress, tokenContractAddress } = action.payload

    const eth = Eth.fromCurrentProvider()
    const wallet: Wallet | null = yield select(getWallet)

    if (!eth || !wallet) {
      throw new Error('Could not connect to Ethereum')
    }

    const { address } = wallet
    const tokenContract = new ERC721(
      eth,
      Address.fromString(tokenContractAddress)
    )
    const transaction: SendTx<ERC721TransactionReceipt> = yield call(() =>
      tokenContract.methods
        .setApprovalForAll(Address.fromString(contractAddress), isApproved)
        .send({ from: Address.fromString(address) })
    )
    const transactionHash: string = yield call(() => transaction.getTxHash())

    yield put(
      approveTokenSuccess(
        transactionHash,
        address,
        isApproved,
        contractAddress,
        tokenContractAddress
      )
    )
  } catch (error) {
    yield put(approveTokenFailure(error.message))
  }
}
