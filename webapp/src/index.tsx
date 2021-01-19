import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ScrollToTop } from './components/ScrollToTop'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'

import './setup'
import './modules/analytics/track'

import * as locales from './modules/translation/locales'
import { store, history } from './modules/store'
import { Routes } from './components/Routes'

import { buildContracts } from './modules/contract/utils'

import './themes'
import './index.css'

buildContracts()

const component = (
  <Provider store={store}>
    <TranslationProvider locales={Object.keys(locales)}>
      <WalletProvider>
        <ConnectedRouter history={history}>
          <ScrollToTop />
          <Routes />
        </ConnectedRouter>
      </WalletProvider>
    </TranslationProvider>
  </Provider>
)

ReactDOM.render(component, document.getElementById('root'))
