import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { ConnectedRouter } from 'connected-react-router'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'

import './modules/analytics/track'
import './modules/analytics/sentry'

import { ScrollToTop } from './components/ScrollToTop'
import * as locales from './modules/translation/locales'
import { initStore, createHistory } from './modules/store'
import { Routes } from './components/Routes'
import * as modals from './components/Modals'

import './themes'
import './index.css'

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
