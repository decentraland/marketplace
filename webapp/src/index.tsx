import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import * as modals from './components/Modals'
import { Routes } from './components/Routes'
import { ScrollToTop } from './components/ScrollToTop'
import './modules/analytics/rollbar'
import './modules/analytics/track'
import './setup'
import * as locales from './modules/translation/locales'
import { initStore, history } from './modules/store'
import './themes'
import './index.css'

async function main() {
  const component = (
    <Provider store={initStore()}>
      <TranslationProvider locales={Object.keys(locales)}>
        <ToastProvider>
          <WalletProvider>
            <ConnectedRouter history={history}>
              <ModalProvider components={modals}>
                <ScrollToTop />
                <Routes />
              </ModalProvider>
            </ConnectedRouter>
          </WalletProvider>
        </ToastProvider>
      </TranslationProvider>
    </Provider>
  )

  ReactDOM.render(component, document.getElementById('root'))
}

main()
