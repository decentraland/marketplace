import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderResult, waitFor, waitForOptions } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'
import flatten from 'flat'
import { Store } from 'redux'
import { en } from 'decentraland-dapps/dist/modules/translation/defaults'
import { mergeTranslations } from 'decentraland-dapps/dist/modules/translation/utils'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import { darkTheme, DclThemeProvider } from 'decentraland-ui2'
import { RootState } from '../modules/reducer'
import { initTestStore } from '../modules/store'
import * as locales from '../modules/translation/locales'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const allTranslations = mergeTranslations(flatten(en), flatten(locales.en) as any)

export function renderWithProviders(
  component: JSX.Element,
  { preloadedState, store }: { preloadedState?: Partial<RootState>; store?: Store } = {}
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

  function AppProviders({ children }: { children: JSX.Element }) {
    return (
      <Provider store={initializedStore}>
        <MemoryRouter>
          <DclThemeProvider theme={darkTheme}>
            <TranslationProvider locales={['en']}>{children}</TranslationProvider>
          </DclThemeProvider>
        </MemoryRouter>
      </Provider>
    )
  }

  return render(component, { wrapper: AppProviders })
}

export async function waitForComponentToFinishLoading(screen: RenderResult, waitForOptions?: waitForOptions) {
  // TODO: Make loader accessible so we can get the info without using the container ui#310
  await waitFor(() => expect(screen.container.getElementsByClassName('loader-container').length).toEqual(0), waitForOptions)
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
