import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage } from 'decentraland-dapps/dist/modules/storage/reducer'
import { transactionReducer as transaction } from 'decentraland-dapps/dist/modules/transaction/reducer'
import { orderReducer as order } from './order/reducer'
import { uiReducer as ui } from './ui/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    wallet,
    translation,
    transaction,
    storage,
    order,
    ui,
    router: connectRouter(history)
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
