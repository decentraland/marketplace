import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage } from 'decentraland-dapps/dist/modules/storage/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { accountReducer as account } from './account/reducer'
import { orderReducer as order } from './order/reducer'
import { uiReducer as ui } from './ui/reducer'
import { nftReducer as nft } from './nft/reducer'
import { contractReducer as contract } from './contract/reducer'
import { tileReducer as tile } from './tile/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    wallet,
    translation,
    transaction,
    storage,
    account,
    order,
    ui,
    nft,
    contract,
    tile,
    router: connectRouter(history)
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
