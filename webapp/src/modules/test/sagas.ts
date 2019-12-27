import { takeLatest, select, put, call } from 'redux-saga/effects'
import {
  SEND_MANA_REQUEST,
  SendMANARequestAction,
  sendMANAFailure,
  sendMANASuccess
} from './actions'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { MANA } from '../../contracts/MANA'
import { toWei } from 'web3x-es/utils'

export function* testSaga() {
  yield takeLatest(SEND_MANA_REQUEST, handleSendMANARequest)
}

function* handleSendMANARequest(action: SendMANARequestAction) {
  const { address, amount } = action.payload
  try {
    const from = yield select(getAddress)
    if (!from) throw new Error('Invalid address')
    const mana = new MANA(
      Eth.fromCurrentProvider()!,
      Address.fromString(process.env.REACT_APP_MANA_ADDRESS!)
    )
    const tx = mana.methods
      .transfer(Address.fromString(address), toWei(amount.toString(), 'ether'))
      .send({ from })
    const hash: string = yield call(() => tx.getTxHash())
    yield put(sendMANASuccess(address, amount, hash))
  } catch (error) {
    yield put(sendMANAFailure(address, amount, error.message))
  }
}
