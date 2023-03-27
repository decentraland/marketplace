import { render, RenderResult, waitFor } from '@testing-library/react'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
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

  function AppProviders({ children }: { children: JSX.Element }) {
    return (
      <Provider store={initializedStore}>
        <TranslationProvider locales={Object.keys(locales)}>
          {children}
        </TranslationProvider>
      </Provider>
    )
  }

  return render(component, { wrapper: AppProviders })
}


export async function waitForComponentToFinishLoading(screen: RenderResult) {
  // TODO: Make loader accessible so we can get the info without using the container ui#310
  await waitFor(() =>
    expect(screen.container.getElementsByClassName('loader-container').length).toEqual(
      0
    )
  )
}
