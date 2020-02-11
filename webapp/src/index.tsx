import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ScrollToTop } from './components/ScrollToTop'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'

import './setup'
import './themes'

import { store, history } from './modules/store'
import { Routes } from './components/Routes'

import './modules/analytics/track'
import './index.css'

const component = (
  <Provider store={store}>
    <TranslationProvider locales={['en']}>
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
