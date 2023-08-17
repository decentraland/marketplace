import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import * as SingleSignOn from '@dcl/single-sign-on-client'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import * as modals from './components/Modals'
import { Routes } from './components/Routes'
import { ScrollToTop } from './components/ScrollToTop'
import { config } from './config'
import './modules/analytics/rollbar'
import './modules/analytics/track'
import { initStore, history } from './modules/store'
import * as locales from './modules/translation/locales'
import './setup'
import './themes'
import './index.css'

// Initializes the SSO client.
// This will create a new iframe and append it to the body.
// It is ideal to do this as soon as possible to avoid any availability issues.
SingleSignOn.init(config.get('SSO_URL'))

async function main() {
  const component = (
    <Provider store={initStore()}>
      <TranslationProvider locales={Object.keys(locales)}>
        <WalletProvider>
          <ConnectedRouter history={history}>
            <ToastProvider>
              <ModalProvider components={modals}>
                <ScrollToTop />
                <Routes />
              </ModalProvider>
            </ToastProvider>
          </ConnectedRouter>
        </WalletProvider>
      </TranslationProvider>
    </Provider>
  )

  ReactDOM.render(component, document.getElementById('root'))
}

main()
