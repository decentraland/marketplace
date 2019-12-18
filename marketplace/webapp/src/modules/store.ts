import { applyMiddleware, compose, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import createHistory from 'history/createBrowserHistory'

import { createRootReducer } from './reducer'
import { rootSaga } from './sagas'

const isDev = process.env.NODE_ENV === 'development'

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()
const rootReducer = createRootReducer(history)

const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({
  collapsed: () => true,
  predicate: (_: any, action) => isDev || action.type.includes('Failure')
})

const middleware = applyMiddleware(
  sagasMiddleware,
  routerMiddleware(history),
  loggerMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(rootReducer, enhancer)

sagasMiddleware.run(rootSaga)

if (isDev) {
  const _window = window as any
  _window.getState = store.getState
}

export { store }
