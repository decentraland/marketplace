import { all } from 'redux-saga/effects'
import { walletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'

import { translationSaga } from './translation/sagas'

export function* rootSaga() {
  yield all([walletSaga(), translationSaga()])
}
