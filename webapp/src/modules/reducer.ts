import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'

import { walletReducer as wallet } from './wallet/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    wallet,
    router: connectRouter(history)
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>
