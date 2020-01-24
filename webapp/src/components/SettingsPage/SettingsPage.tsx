import React, { useEffect } from 'react'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page, Grid, Blockie, Mana, Loader } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { locations } from '../../modules/routing/locations'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const SettingsPage = (props: Props) => {
  const { wallet, isConnecting, onNavigate } = props

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onNavigate(locations.signIn())
    }
  }, [isConnecting, wallet, onNavigate])

  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="SettingsPage">
        {isConnecting ? (
          <Loader size="massive" active />
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Address</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <div>
                  <Blockie seed={wallet!.address} scale={12} />
                  <div className="address">{wallet!.address}</div>
                  <a href="#" className="link">
                    COPY ADDRESS
                  </a>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Balance</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <Mana inline>{wallet!.mana}</Mana>
                <a href="#" className="link">
                  BUY MORE
                </a>
                <a href="#" className="link">
                  TRANSFER
                </a>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Authorizations</div>
              </Grid.Column>
              <Grid.Column width={12}>AUTH</Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SettingsPage)
