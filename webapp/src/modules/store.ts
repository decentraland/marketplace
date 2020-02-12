import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'

import { createRootReducer, RootState } from './reducer'
import { rootSaga } from './sagas'
import { fetchTilesRequest } from './tile/actions'
import { ARCHIVE_BID, UNARCHIVE_BID } from './bid/actions'

const isDev = process.env.NODE_ENV === 'development'

const composeEnhancers =
  isDev && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        stateSanitizer: (state: RootState) => {
          const sanitized = { ...state }
          delete sanitized.tile
          delete sanitized.proximity
          return sanitized
        }
      })
    : compose

export const history = require('history').createBrowserHistory()
const rootReducer = storageReducerWrapper(createRootReducer(history))

const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({
  collapsed: () => true,
  predicate: (_: any, action) => isDev || action.type.includes('Failure')
})
const transactionMiddleware = createTransactionMiddleware()
const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
  storageKey: 'marketplace-v2', // this is the key used to save the state in localStorage (required)
  paths: [['ui', 'archivedBidIds']], // array of paths from state to be persisted (optional)
  actions: [CLEAR_TRANSACTIONS, ARCHIVE_BID, UNARCHIVE_BID], // array of actions types that will trigger a SAVE (optional)
  migrations: {} // migration object that will migrate your localstorage (optional)
})

const middleware = applyMiddleware(
  sagasMiddleware,
  routerMiddleware(history),
  loggerMiddleware,
  transactionMiddleware,
  storageMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(rootReducer, enhancer)

sagasMiddleware.run(rootSaga)
loadStorageMiddleware(store)

if (isDev) {
  const _window = window as any
  _window.getState = store.getState
}

// fetch tiles
store.dispatch(fetchTilesRequest())

export { store }
