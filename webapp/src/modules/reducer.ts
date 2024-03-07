import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage } from 'decentraland-dapps/dist/modules/storage/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { profileReducer as profile } from 'decentraland-dapps/dist/modules/profile/reducer'
import { authorizationReducer as authorization } from 'decentraland-dapps/dist/modules/authorization/reducer'
import { toastReducer as toast } from 'decentraland-dapps/dist/modules/toast/reducer'
import { featuresReducer as features } from 'decentraland-dapps/dist/modules/features/reducer'
import { modalReducer as modal } from 'decentraland-dapps/dist/modules/modal/reducer'
import { gatewayReducer as gateway } from 'decentraland-dapps/dist/modules/gateway/reducer'

import { accountReducer as account } from './account/reducer'
import { bidReducer as bid } from './bid/reducer'
import { itemReducer as item } from './item/reducer'
import { nftReducer as nft } from './nft/reducer'
import { orderReducer as order } from './order/reducer'
import { proximityReducer as proximity } from './proximity/reducer'
import { routingReducer as routing } from './routing/reducer'
import { tileReducer as tile } from './tile/reducer'
import { uiReducer as ui } from './ui/reducer'
import { collectionReducer as collection } from './collection/reducer'
import { storeReducer as store } from './store/reducer'
import { saleReducer as sale } from './sale/reducer'
import { identityReducer as identity } from './identity/reducer'
import { analyticsReducer as analytics } from './analytics/reducer'
import { rentalReducer as rental } from './rental/reducer'
import { eventReducer as event } from './event/reducer'
import { contractReducer as contract } from './contract/reducer'
import { favoritesReducer as favorites } from './favorites/reducer'
import { assetReducer as asset } from './asset/reducer'
import { ensReducer as ens } from './ens/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    asset,
    account,
    authorization,
    bid,
    item,
    nft,
    order,
    rental,
    profile,
    proximity,
    routing,
    storage,
    tile,
    toast,
    transaction,
    translation,
    ui,
    wallet,
    router: connectRouter(history),
    collection,
    store,
    sale,
    identity,
    analytics,
    features,
    event,
    modal,
    contract,
    gateway,
    favorites,
    ens
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
