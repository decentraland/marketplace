import { CatalystClient } from 'dcl-catalyst-client'
import { all } from 'redux-saga/effects'
import { createAnalyticsSaga } from 'decentraland-dapps/dist/modules/analytics/sagas'
import { authorizationSaga } from 'decentraland-dapps/dist/modules/authorization/sagas'
import { featuresSaga } from 'decentraland-dapps/dist/modules/features/sagas'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { createGatewaySaga } from 'decentraland-dapps/dist/modules/gateway/sagas'
import { locationSaga } from 'decentraland-dapps/dist/modules/location/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { NetworkGatewayType } from 'decentraland-ui/dist/components/BuyManaWithFiatModal/Network'
import { config } from '../config'
import { peerUrl } from '../lib/environment'
import { accountSaga } from './account/sagas'
import { analyticsSagas as marketplaceAnalyticsSagas } from './analytics/sagas'
import { assetSaga } from './asset/sagas'
import { bidSaga } from './bid/sagas'
import { collectionSaga } from './collection/sagas'
import { contractSaga } from './contract/sagas'
import { eventSaga } from './event/sagas'
import { identitySaga } from './identity/sagas'
import { itemSaga } from './item/sagas'
import { modalSaga } from './modal/sagas'
import { nftSaga } from './nft/sagas'
import { orderSaga } from './order/sagas'
import { proximitySaga } from './proximity/sagas'
import { rentalSaga } from './rental/sagas'
import { routingSaga } from './routing/sagas'
import { saleSaga } from './sale/sagas'
import { storeSaga } from './store/sagas'
import { tileSaga } from './tile/sagas'
import { toastSaga } from './toast/sagas'
import { transakSaga } from './transak/sagas'
import { translationSaga } from './translation/sagas'
import { uiSaga } from './ui/sagas'
import { walletSaga } from './wallet/sagas'

const analyticsSaga = createAnalyticsSaga()
const profileSaga = createProfileSaga({ peerUrl })
const catalystClient = new CatalystClient({
  catalystUrl: peerUrl
})
const gatewaySaga = createGatewaySaga({
  [NetworkGatewayType.MOON_PAY]: {
    apiBaseUrl: config.get('MOON_PAY_API_URL'),
    apiKey: config.get('MOON_PAY_API_KEY'),
    pollingDelay: +config.get('MOON_PAY_POLLING_DELAY'),
    widgetBaseUrl: config.get('MOON_PAY_WIDGET_URL')
  },
  [NetworkGatewayType.TRANSAK]: {
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV'),
    pusher: {
      appKey: config.get('TRANSAK_PUSHER_APP_KEY'),
      appCluster: config.get('TRANSAK_PUSHER_APP_CLUSTER')
    }
  }
})

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    assetSaga(),
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
    marketplaceAnalyticsSagas(),
    featuresSaga({
      polling: {
        apps: [ApplicationName.MARKETPLACE, ApplicationName.BUILDER],
        delay: 60000 /** 60 seconds */
      }
    }),
    rentalSaga(),
    modalSaga(),
    eventSaga(),
    contractSaga(),
    gatewaySaga(),
    locationSaga(),
    transakSaga()
  ])
}
