import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navigation } from '../Navigation'
import { Props, State } from './TestPage.types'

import './TestPage.css'

export default class TestPage extends React.PureComponent<Props, State> {
  state = {
    amount: '0',
    address: '0x'
  }
  render() {
    const { transactions, onSend } = this.props
    const { address, amount } = this.state
    return (
      <>
        <Navbar isFullscreen activePage="marketplace" />
        <Navigation />
        <Page className="TestPage">
          <label>Address</label>
          <input
            value={address}
            onChange={e => this.setState({ address: e.target.value })}
          />
          <label>Amount</label>
          <input
            value={amount}
            onChange={e => this.setState({ amount: e.target.value })}
          />
          <button onClick={() => onSend(address, +amount)}>Send</button>
          <div>
            <header>
              <b>Transactions</b>
            </header>
            {transactions.map(t => {
              const { address, amount } = t.payload as {
                address: string
                amount: number
              }
              return (
                <p key={t.hash}>
                  Transferred {amount} MANA to {address.slice(0, 6)}...
                  {address.slice(-4)} - {t.status?.toUpperCase()}
                </p>
              )
            })}
          </div>
        </Page>
        <Footer />
      </>
    )
  }
}
