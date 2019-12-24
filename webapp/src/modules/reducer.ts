import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { translationReducer as translation } from 'decentraland-dapps/dist/modules/translation/reducer'
import { storageReducer as storage } from 'decentraland-dapps/dist/modules/storage/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    wallet,
    translation,
    storage,
    router: connectRouter(history)
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
