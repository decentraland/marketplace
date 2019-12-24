import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'

import { createRootReducer } from './reducer'
import { rootSaga } from './sagas'

const isDev = process.env.NODE_ENV === 'development'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = require('history').createBrowserHistory()
const rootReducer = storageReducerWrapper(createRootReducer(history))

const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({
  collapsed: () => true,
  predicate: (_: any, action) => isDev || action.type.includes('Failure')
})
const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
  storageKey: 'marketplace-v2', // this is the key used to save the state in localStorage (required)
  paths: [], // array of paths from state to be persisted (optional)
  actions: [], // array of actions types that will trigger a SAVE (optional)
  migrations: {} // migration object that will migrate your localstorage (optional)
})

const middleware = applyMiddleware(
  sagasMiddleware,
  routerMiddleware(history),
  loggerMiddleware,
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

export { store }
