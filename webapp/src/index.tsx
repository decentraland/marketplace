import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { Web2TransactionModal } from 'decentraland-dapps/dist/containers'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { darkTheme, DclThemeProvider } from 'decentraland-ui2'
import * as modals from './components/Modals'
import { Routes } from './components/Routes'
import { ScrollToTop } from './components/ScrollToTop'
import './modules/analytics/sentry'
import './modules/analytics/track'
import { initStore, createHistory } from './modules/store'
import * as locales from './modules/translation/locales'
import './themes'
import './index.css'

const history = createHistory()
const store = initStore(history)

function main() {
  const component = (
    <Provider store={store}>
      <Router history={history}>
        <TranslationProvider locales={Object.keys(locales)}>
          <WalletProvider>
            <DclThemeProvider theme={darkTheme}>
              <ToastProvider>
                <ModalProvider components={modals}>
                  <ScrollToTop />
                  <Routes />
                </ModalProvider>
              </ToastProvider>
              <Web2TransactionModal />
            </DclThemeProvider>
          </WalletProvider>
        </TranslationProvider>
      </Router>
    </Provider>
  )

  const container = document.getElementById('root')!
  createRoot(container).render(component)
}

main()
