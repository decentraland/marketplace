import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { put, call, takeEvery } from 'redux-saga/effects'

import { ERC20 } from '../../contracts/ERC20'
import { ERC721 } from '../../contracts/ERC721'
import { tokenContracts, nftContracts } from '../contract/utils'
import { Allowances, Approvals } from './types'
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
    if (!eth) throw new Error('Could not connect to Ethereum')

    const payload = action.payload
    const address = payload.address.toLowerCase()

    // ------------------------

    let allowances: Allowances = {}

    console.log('-==========>', payload.allowances)

    for (const contractAddress in payload.allowances) {
      const tokenContractAddresses = payload.allowances[contractAddress]

      for (const tokenContractAddress of tokenContractAddresses) {
        const nftContract = tokenContracts[tokenContractAddress]
        if (!nftContract) {
          continue
        }
        const contractAddress = Address.fromString(nftContract.address)
        const contract = new ERC20(eth, contractAddress)
        const result: string = yield call(() =>
          contract.methods
            .allowance(Address.fromString(address), contractAddress)
            .call()
        )

        allowances[nftContract.address] = {
          ...allowances[nftContract.address],
          [tokenContractAddress]: parseInt(result, 10)
        }
      }
    }

    // ------------------------

    let approvals: Approvals = {}

    for (const contractAddress in payload.approvals) {
      const tokenContractAddresses = payload.approvals[contractAddress]

      for (const tokenContractAddress of tokenContractAddresses) {
        const tokenContract = nftContracts[tokenContractAddress]
        if (!tokenContract) {
          continue
        }
        const contractAddress = Address.fromString(tokenContract.address)
        const contract = new ERC721(eth, contractAddress)
        const result: boolean = yield call(() =>
          contract.methods
            .isApprovedForAll(Address.fromString(address), contractAddress)
            .call()
        )

        approvals[tokenContract.address] = {
          ...approvals[tokenContract.address],
          [tokenContractAddress]: result
        }
      }
    }

    // ------------------------

    const authorization = { allowances, approvals }
    console.log('AUTH', authorization)

    yield put(fetchAuthorizationSuccess(address, authorization))
  } catch (error) {
    yield put(fetchAuthorizationFailure(error.message))
  }
}

function* handleAllowTokenRequest(action: AllowTokenRequestAction) {
  try {
    const { amount, contractAddress, tokenContractAddress } = action.payload

    const eth = Eth.fromCurrentProvider()
    if (!eth) throw new Error('Could not connect to Ethereum')

    const accounts = yield call(() => eth.getAccounts())
    const address = accounts[0]

    const contractToApproveAddress = Address.fromString('')
    const tokenContract = new ERC20(eth, Address.fromString(contractAddress))
    const { transactionHash } = yield call(() =>
      tokenContract.methods.approve(contractToApproveAddress, amount).send()
    )

    yield put(
      allowTokenSuccess(
        transactionHash,
        address,
        amount,
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
    if (!eth) throw new Error('Could not connect to Ethereum')

    const accounts = yield call(() => eth.getAccounts())
    const address = accounts[0]

    const tokenContract = new ERC721(
      eth,
      Address.fromString(tokenContractAddress)
    )
    const { transactionHash } = yield call(() =>
      tokenContract.methods
        .setApprovalForAll(Address.fromString(contractAddress), isApproved)
        .send()
    )

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
