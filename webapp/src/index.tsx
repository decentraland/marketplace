import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { store, history } from './modules/store'
import * as serviceWorker from './serviceWorker'
import App from './App'

import './index.css'

const component = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </ConnectedRouter>
  </Provider>
)

ReactDOM.render(component, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
