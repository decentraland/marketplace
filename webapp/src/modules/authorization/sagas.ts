import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { put, call, takeEvery } from 'redux-saga/effects'

import { ERC20 } from '../../contracts/ERC20'
import { ERC721 } from '../../contracts/ERC721'
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

    for (const contractName in payload.allowances) {
      const tokenContractNames = payload.allowances[contractName]

      for (const tokenContractName of tokenContractNames) {
        const contractAddress = Address.fromString('')
        const contract = new ERC20(eth, contractAddress)
        const result: string = yield call(() =>
          contract.methods
            .allowance(Address.fromString(address), contractAddress)
            .call()
        )

        allowances[contractName] = {
          ...allowances[contractName],
          [tokenContractName]: parseInt(result, 10)
        }
      }
    }

    // ------------------------

    let approvals: Approvals = {}

    for (const contractName in payload.approvals) {
      const tokenContractNames = payload.approvals[contractName]

      for (const tokenContractName of tokenContractNames) {
        const contractAddress = Address.fromString('')
        const contract = new ERC721(eth, contractAddress)
        const result: boolean = yield call(() =>
          contract.methods
            .isApprovedForAll(Address.fromString(address), contractAddress)
            .call()
        )

        approvals[contractName] = {
          ...approvals[contractName],
          [tokenContractName]: result
        }
      }
    }

    // ------------------------

    const authorization = { allowances, approvals }

    yield put(fetchAuthorizationSuccess(address, authorization))
  } catch (error) {
    yield put(fetchAuthorizationFailure(error.message))
  }
}

function* handleAllowTokenRequest(action: AllowTokenRequestAction) {
  try {
    const {
      amount,
      contractName,
      tokenContractName = 'MANAToken'
    } = action.payload

    const eth = Eth.fromCurrentProvider()
    if (!eth) throw new Error('Could not connect to Ethereum')

    const accounts = yield call(() => eth.getAccounts())
    const address = accounts[0]

    // const contractToApprove = eth.getContract(contractName)
    // const tokenContract = eth.getContract(tokenContractName)

    const contractAddress = Address.fromString('')
    const contractToApproveAddress = Address.fromString('')
    const tokenContract = new ERC20(eth, contractAddress)
    const { transactionHash } = yield call(() =>
      tokenContract.methods.approve(contractToApproveAddress, amount).send()
    )

    yield put(
      allowTokenSuccess(
        transactionHash,
        address,
        amount,
        contractName,
        tokenContractName
      )
    )
  } catch (error) {
    yield put(allowTokenFailure(error.message))
  }
}

function* handleApproveTokenRequest(action: ApproveTokenRequestAction) {
  try {
    const {
      isApproved,
      contractName,
      tokenContractName = 'LANDRegistry'
    } = action.payload
    const eth = Eth.fromCurrentProvider()
    if (!eth) throw new Error('Could not connect to Ethereum')

    const accounts = yield call(() => eth.getAccounts())
    const address = accounts[0]

    // const contractToApprove = eth.getContract(contractName)
    // const tokenContract = eth.getContract(tokenContractName)

    const contractAddress = Address.fromString('')
    const contractToApproveAddress = Address.fromString('')
    const tokenContract = new ERC721(eth, contractAddress)
    const { transactionHash } = yield call(() =>
      tokenContract.methods
        .setApprovalForAll(contractToApproveAddress, isApproved)
        .send()
    )

    yield put(
      approveTokenSuccess(
        transactionHash,
        address,
        isApproved,
        contractName,
        tokenContractName
      )
    )
  } catch (error) {
    yield put(approveTokenFailure(error.message))
  }
}
