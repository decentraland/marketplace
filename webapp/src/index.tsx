import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import * as SingleSignOn from '@dcl/single-sign-on-client'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'

import './setup'
import './modules/analytics/track'
import './modules/analytics/sentry'

import { ScrollToTop } from './components/ScrollToTop'
import * as locales from './modules/translation/locales'
import { initStore, createHistory } from './modules/store'
import { Routes } from './components/Routes'
import * as modals from './components/Modals'
import { config } from './config'

import './themes'
import './index.css'

// Initializes the SSO client.
// This will create a new iframe and append it to the body.
// It is ideal to do this as soon as possible to avoid any availability issues.
SingleSignOn.init(config.get('SSO_URL'))

const history = createHistory()
const store = initStore(history)

async function main() {
  const component = (
    <Provider store={store}>
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
