import { all } from 'redux-saga/effects'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { authorizationSaga } from 'decentraland-dapps/dist/modules/authorization/sagas'
import { createAnalyticsSaga } from 'decentraland-dapps/dist/modules/analytics/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { featuresSaga } from 'decentraland-dapps/dist/modules/features/sagas'
import { createGatewaySaga } from 'decentraland-dapps/dist/modules/gateway/sagas'
import { locationSaga } from 'decentraland-dapps/dist/modules/location/sagas'
import { createLambdasClient } from 'dcl-catalyst-client/dist/client/LambdasClient'
import { createContentClient } from 'dcl-catalyst-client/dist/client/ContentClient'
import { NetworkGatewayType } from 'decentraland-ui/dist/components/BuyManaWithFiatModal/Network'
import { createFetchComponent } from '@well-known-components/fetch-component'

import { config } from '../config'
import { peerUrl } from '../lib/environment'
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
import { rentalSaga } from './rental/sagas'
import { modalSaga } from './modal/sagas'
import { eventSaga } from './event/sagas'
import { contractSaga } from './contract/sagas'
import { transakSaga } from './transak/sagas'
import { assetSaga } from './asset/sagas'
import { favoritesSaga } from './favorites/sagas'

const analyticsSaga = createAnalyticsSaga()
const profileSaga = createProfileSaga({ peerUrl })
const lambdasClient = createLambdasClient({
  url: peerUrl,
  fetcher: createFetchComponent()
})
const contentClient = createContentClient({ url: peerUrl, fetcher: createFetchComponent() })

const gatewaySaga = createGatewaySaga({
  [NetworkGatewayType.MOON_PAY]: {
    apiBaseUrl: config.get('MOON_PAY_API_URL'),
    apiKey: config.get('MOON_PAY_API_KEY'),
    pollingDelay: +config.get('MOON_PAY_POLLING_DELAY'),
    widgetBaseUrl: config.get('MOON_PAY_WIDGET_URL')
  },
  [NetworkGatewayType.TRANSAK]: {
    apiBaseUrl: config.get('TRANSAK_API_URL'),
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV'),
    pollingDelay: +config.get('TRANSAK_POLLING_DELAY'),
    pusher: {
      appKey: config.get('TRANSAK_PUSHER_APP_KEY'),
      appCluster: config.get('TRANSAK_PUSHER_APP_CLUSTER')
    }
  }
})

export function* rootSaga(getIdentity: () => AuthIdentity | undefined) {
  yield all([
    analyticsSaga(),
    assetSaga(),
    authorizationSaga(),
    bidSaga(),
    itemSaga(getIdentity),
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
    accountSaga(lambdasClient),
    collectionSaga(),
    storeSaga(contentClient),
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
    transakSaga(),
    favoritesSaga(getIdentity)
  ])
}
