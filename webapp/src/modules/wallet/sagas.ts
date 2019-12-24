import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { put, call, takeLatest, all } from 'redux-saga/effects'
import {
  connectWalletSuccess,
  connectWalletFailure,
  CONNECT_WALLET_REQUEST
} from './actions'
import { MANA_ADDRESS } from './constants'
import { MANA } from '../../contracts/MANA'
import { Wallet } from './types'
import { fromWei } from 'web3x-es/utils'

export function* walletSaga() {
  yield all([takeLatest(CONNECT_WALLET_REQUEST, handleConnectWalletRequest)])
}

export function* handleConnectWalletRequest() {
  try {
    const eth = Eth.fromCurrentProvider()
    if (!eth) {
      // this could happen if metamask is not installed
      throw new Error('Could not connect to Ethereum')
    }
    const accounts: Address[] = yield call(() => eth.getAccounts())
    const address = accounts[0]
    if (!address) {
      // this could happen if the user reject the metamask prompt
      throw new Error('Could not get address')
    }
    const network = yield call(() => eth.getId())
    const ethBalance = yield call(() => eth.getBalance(address))
    const mana = new MANA(eth, Address.fromString(MANA_ADDRESS))
    const manaBalance = yield call(() => mana.methods.balanceOf(address).call())

    const wallet: Wallet = {
      address: address.toString(),
      mana: parseFloat(fromWei(manaBalance, 'ether')),
      eth: parseFloat(fromWei(ethBalance, 'ether')),
      network
    }

    yield put(connectWalletSuccess(wallet))
  } catch (error) {
    yield put(connectWalletFailure(error.message))
  }
}
