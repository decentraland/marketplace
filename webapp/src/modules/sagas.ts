import { all } from 'redux-saga/effects'
import { authorizationSaga } from 'decentraland-dapps/dist/modules/authorization/sagas'
import { createAnalyticsSaga } from 'decentraland-dapps/dist/modules/analytics/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { CatalystClient } from 'dcl-catalyst-client'

import { analyticsSagas as marketplaceAnalyticsSagas } from './analytics/sagas'
import { bidSaga } from './bid/sagas'
import { nftSaga } from './nft/sagas'
import { orderSaga } from './order/sagas'
import { proximitySaga } from './proximity/sagas'
import { routingSaga } from './routing/sagas'
import { tileSaga } from './tile/sagas'
import { toastSaga } from './toast/sagas'
import { translationSaga } from './translation/sagas'
import { uiSaga } from './ui/sagas'
import { walletSaga } from './wallet/sagas'
import { itemSaga } from './item/sagas'
import { collectionSaga } from './collection/sagas'
import { saleSaga } from './sale/sagas'
import { accountSaga } from './account/sagas'
import { storeSaga } from './store/sagas'
import { identitySaga } from './identity/sagas'
import { peerUrl } from '../lib/environment'

const analyticsSaga = createAnalyticsSaga()
const profileSaga = createProfileSaga({ peerUrl })
const catalystClient = new CatalystClient({
  catalystUrl: peerUrl
})

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    authorizationSaga(),
    bidSaga(),
    itemSaga(),
    nftSaga(),
    orderSaga(),
    profileSaga(),
    proximitySaga(),
    routingSaga(),
    tileSaga(),
    toastSaga(),
    transactionSaga(),
    translationSaga(),
    uiSaga(),
    walletSaga(),
    collectionSaga(),
    saleSaga(),
    accountSaga(),
    collectionSaga(),
    storeSaga(catalystClient),
    identitySaga(),
    marketplaceAnalyticsSagas()
  ])
}
