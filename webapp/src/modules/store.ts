import { createBrowserHistory, History, Location } from 'history'
import { Action, applyMiddleware, compose, createStore, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagasMiddleware from 'redux-saga'
import { Env } from '@dcl/ui-env'
import { createAnalyticsMiddleware } from 'decentraland-dapps/dist/modules/analytics/middleware'
import { fetchCampaignRequest } from 'decentraland-dapps/dist/modules/campaign/actions'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { fetchTranslationsRequest } from 'decentraland-dapps/dist/modules/translation/actions'
import { getPreferredLocale } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { Locale } from 'decentraland-ui'
import { config } from '../config'
import { ARCHIVE_BID, UNARCHIVE_BID } from './bid/actions'
import { getCurrentIdentity } from './identity/selectors'
import { createRootReducer, RootState } from './reducer'
import { rootSaga } from './sagas'
import { fetchTilesRequest } from './tile/actions'
import { ExtendedHistory } from './types'
import { SET_IS_TRYING_ON } from './ui/preview/actions'

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/marketplace' : undefined

export const createHistory = () => {
  const history = createBrowserHistory({ basename }) as ExtendedHistory
  const locations: Location[] = []

  history.listen((location, action) => {
    if (action === 'PUSH') {
      locations.push(location)
      if (locations.length > 5) {
        locations.shift()
      }
    }
  })

  history.getLastVisitedLocations = (n?: number) => {
    if (n) {
      return locations.slice(-n)
    }
    return locations
  }

  return history
}

export function initStore(history: History) {
  const anyWindow = window as unknown as Window & { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; getState: any }

  const isDev = config.is(Env.DEVELOPMENT)

  const composeEnhancers = (
    isDev && anyWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? anyWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          stateSanitizer: (state: RootState) => {
            const { tile, proximity, ...sanitized } = { ...state }
            return sanitized
          }
        })
      : compose
  ) as typeof compose

  const rootReducer = storageReducerWrapper(createRootReducer())

  const sagasMiddleware = createSagasMiddleware({ context: { history } })
  const loggerMiddleware = createLogger({
    collapsed: () => true,
    predicate: (_: any, action: Action<string>) => isDev || action.type.includes('Failure')
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
  }) as { storageMiddleware: Middleware; loadStorageMiddleware: Middleware }
  const analyticsMiddleware = createAnalyticsMiddleware(config.get('SEGMENT_API_KEY'))

  const middleware = applyMiddleware(sagasMiddleware, loggerMiddleware, transactionMiddleware, storageMiddleware, analyticsMiddleware)
  const enhancer = composeEnhancers(middleware)
  const store = createStore(rootReducer as unknown as ReturnType<typeof createRootReducer>, enhancer)
  const getIdentity = () => {
    return (getCurrentIdentity(store.getState()) as AuthIdentity | null) ?? undefined
  }
  sagasMiddleware.run(rootSaga, getIdentity)
  loadStorageMiddleware(store)

  if (isDev) {
    anyWindow.getState = store.getState.bind(store)
  }

  // fetch tiles and translations
  store.dispatch(fetchTilesRequest())
  store.dispatch(fetchCampaignRequest())

  // Fetch translations - needed because TranslationProvider's componentDidUpdate
  // doesn't fire when locale is already set on first render
  const locales = ['en', 'es', 'zh'] as Locale[]
  const preferredLocale = getPreferredLocale(locales) || locales[0]
  store.dispatch(fetchTranslationsRequest(preferredLocale))

  return store
}

export function initTestStore(preloadedState = {}) {
  const rootReducer = storageReducerWrapper(createRootReducer())
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
  }) as { storageMiddleware: Middleware; loadStorageMiddleware: Middleware }

  const middleware = applyMiddleware(sagasMiddleware, transactionMiddleware, storageMiddleware)
  const enhancer = compose(middleware)
  const store = createStore(rootReducer, preloadedState, enhancer)
  sagasMiddleware.run(rootSaga, () => undefined)
  loadStorageMiddleware(store)
  store.dispatch(fetchTilesRequest())

  return store
}
