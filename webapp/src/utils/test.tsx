import { render, RenderResult, waitFor } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import mediaQuery from 'css-mediaquery'
import flatten from 'flat'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import { mergeTranslations } from 'decentraland-dapps/dist/modules/translation/utils'
import { en } from 'decentraland-dapps/dist/modules/translation/defaults'
import { RootState } from '../modules/reducer'
import { initTestStore } from '../modules/store'
import * as locales from '../modules/translation/locales'

const allTranslations = mergeTranslations(
  flatten(en) as any,
  flatten(locales.en)
)

export function renderWithProviders(
  component: JSX.Element,
  {
    preloadedState,
    store
  }: { preloadedState?: Partial<RootState>; store?: Store } = {}
) {
  const initializedStore =
    store ||
    initTestStore({
      ...(preloadedState || {}),
      storage: { loading: false },
      translation: {
        data: {
          en: allTranslations
        },
        locale: 'en'
      }
    })
  const history = createMemoryHistory()

  function AppProviders({ children }: { children: JSX.Element }) {
    return (
      <Provider store={initializedStore}>
        <TranslationProvider locales={['en']}>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
        </TranslationProvider>
      </Provider>
    )
  }

  return render(component, { wrapper: AppProviders })
}

export async function waitForComponentToFinishLoading(screen: RenderResult) {
  // TODO: Make loader accessible so we can get the info without using the container ui#310
  await waitFor(() =>
    expect(
      screen.container.getElementsByClassName('loader-container').length
    ).toEqual(0)
  )
}

export function createMatchMedia(width: number) {
  return (query: string) => {
    return {
      matches: mediaQuery.match(query, { width }),
      media: '',
      addListener: () => {},
      removeListener: () => {},
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    }
  }
}
