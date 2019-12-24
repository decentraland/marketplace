import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import WalletProvider from './providers/WalletProvider'

import './setup'
import './themes'

import { store, history } from './modules/store'
import { Routes } from './components/Routes'

import './index.css'

const component = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <WalletProvider>
        <Router>
          <Routes />
        </Router>
      </WalletProvider>
    </ConnectedRouter>
  </Provider>
)

ReactDOM.render(component, document.getElementById('root'))
