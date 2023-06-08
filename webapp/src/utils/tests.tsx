import { render } from '@testing-library/react'
import createSagasMiddleware from 'redux-saga'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, Store } from 'redux'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import { createRootReducer, RootState } from '../modules/reducer'
import * as locales from '../modules/translation/locales'
import { ARCHIVE_BID, UNARCHIVE_BID } from '../modules/bid/actions'
import { GENERATE_IDENTITY_SUCCESS } from '../modules/identity/actions'
import { SET_IS_TRYING_ON } from '../modules/ui/preview/actions'
import { rootSaga } from '../modules/sagas'
import { fetchTilesRequest } from '../modules/tile/actions'

export const history = require('history').createBrowserHistory()

export function initTestStore(preloadedState = {}) {
  const rootReducer = storageReducerWrapper(createRootReducer(history))
  const sagasMiddleware = createSagasMiddleware()
  const transactionMiddleware = createTransactionMiddleware()
  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: 'marketplace-v2', // this is the key used to save the state in localStorage (required)
    paths: [
      ['ui', 'archivedBidIds'],
      ['ui', 'preview', 'isTryingOn'],
      ['identity', 'data']
    ], // array of paths from state to be persisted (optional)
    actions: [
      CLEAR_TRANSACTIONS,
      ARCHIVE_BID,
      UNARCHIVE_BID,
      GENERATE_IDENTITY_SUCCESS,
      SET_IS_TRYING_ON
    ], // array of actions types that will trigger a SAVE (optional)
    migrations: {} // migration object that will migrate your localstorage (optional)
  })

  const middleware = applyMiddleware(
    sagasMiddleware,
    routerMiddleware(history),
    transactionMiddleware,
    storageMiddleware
  )
  const enhancer = compose(middleware)
  const store = createStore(rootReducer, preloadedState, enhancer)

  sagasMiddleware.run(rootSaga, () => undefined)
  loadStorageMiddleware(store)
  store.dispatch(fetchTilesRequest())

  return store
}

export function renderWithProviders(
  component: JSX.Element,
  { preloadedState, store }: { preloadedState?: RootState; store?: Store } = {}
) {
  const initializedStore =
    store ||
    initTestStore({
      ...(preloadedState || {}),
      storage: { loading: false },
      translation: { data: locales, locale: 'en' }
    })

  const history = createMemoryHistory()

  function AppProviders({ children }: { children: JSX.Element }) {
    return (
      <Provider store={initializedStore}>
        <TranslationProvider locales={Object.keys(locales)}>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
        </TranslationProvider>
      </Provider>
    )
  }

  return render(component, { wrapper: AppProviders })
}
