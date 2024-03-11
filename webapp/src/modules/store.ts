import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import { Env } from '@dcl/ui-env'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { createAnalyticsMiddleware } from 'decentraland-dapps/dist/modules/analytics/middleware'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'

import { config } from '../config'
import { createRootReducer, RootState } from './reducer'
import { rootSaga } from './sagas'
import { fetchTilesRequest } from './tile/actions'
import { ARCHIVE_BID, UNARCHIVE_BID } from './bid/actions'
import { SET_IS_TRYING_ON } from './ui/preview/actions'
import { getCurrentIdentity } from './identity/selectors'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { createMemoryHistory, createBrowserHistory, History } from 'history'

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/marketplace' : undefined

export const createHistory = () => createBrowserHistory({ basename })

export function initStore(history: History) {
  const anyWindow = window as any

  const isDev = config.is(Env.DEVELOPMENT)

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
    paths: [
      ['ui', 'archivedBidIds'],
      ['ui', 'preview', 'isTryingOn']
    ], // array of paths from state to be persisted (optional)
    actions: [CLEAR_TRANSACTIONS, ARCHIVE_BID, UNARCHIVE_BID, SET_IS_TRYING_ON], // array of actions types that will trigger a SAVE (optional)
    migrations: {} // migration object that will migrate your localstorage (optional)
  })
  const analyticsMiddleware = createAnalyticsMiddleware(config.get('SEGMENT_API_KEY'))

  const middleware = applyMiddleware(
    sagasMiddleware,
    routerMiddleware(history),
    loggerMiddleware,
    transactionMiddleware,
    storageMiddleware,
    analyticsMiddleware
  )
  const enhancer = composeEnhancers(middleware)
  const store = createStore(rootReducer as unknown as ReturnType<typeof createRootReducer>, enhancer)
  const getIdentity = () => {
    return (getCurrentIdentity(store.getState()) as AuthIdentity | null) ?? undefined
  }
  sagasMiddleware.run(rootSaga, getIdentity)
  loadStorageMiddleware(store)

  if (isDev) {
    const _window = window as any
    _window.getState = store.getState
  }

  // fetch tiles
  store.dispatch(fetchTilesRequest())

  return store
}

export function initTestStore(preloadedState = {}) {
  const testHistory = createMemoryHistory({ initialEntries: ['/marketplace'] })
  const rootReducer = storageReducerWrapper(createRootReducer(testHistory))
  const sagasMiddleware = createSagasMiddleware()
  const transactionMiddleware = createTransactionMiddleware()
  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: 'marketplace-v2', // this is the key used to save the state in localStorage (required)
    paths: [
      ['ui', 'archivedBidIds'],
      ['ui', 'preview', 'isTryingOn']
    ], // array of paths from state to be persisted (optional)
    actions: [CLEAR_TRANSACTIONS, ARCHIVE_BID, UNARCHIVE_BID, SET_IS_TRYING_ON], // array of actions types that will trigger a SAVE (optional)
    migrations: {} // migration object that will migrate your localstorage (optional)
  })

  const middleware = applyMiddleware(sagasMiddleware, routerMiddleware(testHistory), transactionMiddleware, storageMiddleware)
  const enhancer = compose(middleware)
  const store = createStore(rootReducer, preloadedState, enhancer)
  sagasMiddleware.run(rootSaga, () => undefined)
  loadStorageMiddleware(store)
  store.dispatch(fetchTilesRequest())

  return store
}
