import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore, Store, Middleware } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { storageReducerWrapper } from 'decentraland-dapps/dist/modules/storage/reducer'
import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'
import { createTransactionMiddleware } from 'decentraland-dapps/dist/modules/transaction/middleware'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import { ARCHIVE_BID, UNARCHIVE_BID } from '../modules/bid/actions'
import { GENERATE_IDENTITY_SUCCESS } from '../modules/identity/actions'
import { createRootReducer, RootState } from '../modules/reducer'
import { rootSaga } from '../modules/sagas'
import { fetchTilesRequest } from '../modules/tile/actions'
import * as locales from '../modules/translation/locales'
import { SET_IS_TRYING_ON } from '../modules/ui/preview/actions'

export const history = createBrowserHistory()

export function initTestStore(preloadedState = {}) {
  const rootReducer = storageReducerWrapper(createRootReducer())
  const sagasMiddleware = createSagasMiddleware()
  const transactionMiddleware = createTransactionMiddleware()
  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: 'marketplace-v2', // this is the key used to save the state in localStorage (required)
    paths: [
      ['ui', 'archivedBidIds'],
      ['ui', 'preview', 'isTryingOn'],
      ['identity', 'data']
    ], // array of paths from state to be persisted (optional)
    actions: [CLEAR_TRANSACTIONS, ARCHIVE_BID, UNARCHIVE_BID, GENERATE_IDENTITY_SUCCESS, SET_IS_TRYING_ON], // array of actions types that will trigger a SAVE (optional)
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

export function renderWithProviders(component: JSX.Element, { preloadedState, store }: { preloadedState?: RootState; store?: Store } = {}) {
  const initializedStore =
    store ||
    initTestStore({
      ...(preloadedState || {}),
      storage: { loading: false },
      translation: { data: locales, locale: 'en' }
    })

  function AppProviders({ children }: { children: JSX.Element }) {
    return (
      <Provider store={initializedStore}>
        <MemoryRouter>
          <TranslationProvider locales={Object.keys(locales)}>{children}</TranslationProvider>
        </MemoryRouter>
      </Provider>
    )
  }

  return render(component, { wrapper: AppProviders })
}
