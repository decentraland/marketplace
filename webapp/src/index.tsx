import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { Web2TransactionModal } from 'decentraland-dapps/dist/containers'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { lightTheme, DclThemeProvider } from 'decentraland-ui2'
import { CartProvider } from './components/Cart'
import { FittingRoomProvider } from './components/FittingRoom'
import * as modals from './components/Modals'
import { Routes } from './components/Routes'
import { ScrollToTop } from './components/ScrollToTop'
import { enableCuratedMarketplace } from './demo/curatedMarketplace'
import './modules/analytics/sentry'
import './modules/analytics/track'
import { initStore, createHistory } from './modules/store'
import * as locales from './modules/translation/locales'
import './themes'
import './index.css'

// Demo: serve the catalog from the curated active-creators dataset.
enableCuratedMarketplace()

const history = createHistory()
const store = initStore(history)

function main() {
  const component = (
    <Provider store={store}>
      <Router history={history}>
        <TranslationProvider locales={Object.keys(locales)}>
          <WalletProvider>
            <DclThemeProvider theme={lightTheme}>
              <CartProvider>
                {/* Demo: try-on drawer, opened from the cards' try-on button. */}
                <FittingRoomProvider>
                  <ToastProvider>
                    <ModalProvider components={modals}>
                      <ScrollToTop />
                      <Routes />
                    </ModalProvider>
                  </ToastProvider>
                  <Web2TransactionModal />
                </FittingRoomProvider>
              </CartProvider>
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
