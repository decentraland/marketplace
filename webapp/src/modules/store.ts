import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { createAnalyticsMiddleware } from 'decentraland-dapps/dist/modules/analytics/middleware'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'

import { createRootReducer, RootState } from './reducer'
import { rootSaga } from './sagas'
import { fetchTilesRequest } from './tile/actions'
import { ARCHIVE_BID, UNARCHIVE_BID } from './bid/actions'

export const history = require('history').createBrowserHistory()

export function initStore() {
  const isDev = process.env.NODE_ENV === 'development'
  const anyWindow = window as any

  const composeEnhancers =
    isDev && anyWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? anyWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          stateSanitizer: (state: RootState) => {
            const { tile, proximity, ...sanitized } = { ...state }
            return sanitized
          }
        })
      : compose

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
  const analyticsMiddleware = createAnalyticsMiddleware(
    process.env.REACT_APP_SEGMENT_API_KEY || ''
  )

  const middleware = applyMiddleware(
    sagasMiddleware,
    routerMiddleware(history),
    loggerMiddleware,
    transactionMiddleware,
    storageMiddleware,
    analyticsMiddleware
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

  return store
}
