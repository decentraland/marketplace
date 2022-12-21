import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ScrollToTop } from './components/ScrollToTop'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import ToastProvider from 'decentraland-dapps/dist/providers/ToastProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import ModalProvider from 'decentraland-dapps/dist/providers/ModalProvider'

import './setup'
import './modules/analytics/track'
import './modules/analytics/rollbar'

import * as locales from './modules/translation/locales'
import { initStore, history } from './modules/store'
import { Routes } from './components/Routes'
import * as modals from './components/Modals'
import { RentalsLaunchModal } from './components/Modals/RentalsLaunchModal'

import './themes'
import './index.css'

async function main() {
  const component = (
    <Provider store={initStore()}>
      <TranslationProvider locales={Object.keys(locales)}>
        <ToastProvider>
          <WalletProvider>
            <ModalProvider components={modals}>
              <ConnectedRouter history={history}>
                <ScrollToTop />
                <Routes />
                <RentalsLaunchModal />
              </ConnectedRouter>
            </ModalProvider>
          </WalletProvider>
        </ToastProvider>
      </TranslationProvider>
    </Provider>
  )

  ReactDOM.render(component, document.getElementById('root'))
}

main()
