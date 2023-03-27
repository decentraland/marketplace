import { render } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { RootState } from '../modules/reducer'
import { initTestStore } from '../modules/store'
import * as locales from '../modules/translation/locales'

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
