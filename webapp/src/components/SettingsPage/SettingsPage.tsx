import React, { useState, useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page, Grid, Blockie, Mana, Loader } from 'decentraland-ui'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { locations } from '../../modules/routing/locations'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const BUY_MANA_URL = process.env.REACT_APP_BUY_MANA_URL

const SettingsPage = (props: Props) => {
  const { wallet, isConnecting, onNavigate } = props

  const [hasCopiedText, setHasCopiedText] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  )

  const handleOnCopy = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setHasCopiedText(true)
    const newTimeoutId = setTimeout(() => setHasCopiedText(false), 1200)
    setTimeoutId(newTimeoutId)
  }, [timeoutId])

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
                <Blockie seed={wallet!.address} scale={12} />
                <div className="address-container">
                  <div className="address">{wallet!.address}</div>
                  <CopyToClipboard text={wallet!.address} onCopy={handleOnCopy}>
                    {hasCopiedText ? (
                      <span className="copy-text">
                        {t('settings_page.copied')}
                      </span>
                    ) : (
                      <span className="copy-text link">
                        {t('settings_page.copy_address')}
                      </span>
                    )}
                  </CopyToClipboard>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Balance</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <div className="balance">
                  <Mana inline>{wallet!.mana}</Mana>
                  {BUY_MANA_URL ? (
                    <a
                      className="buy-more"
                      href={BUY_MANA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('settings_page.buy_more_mana')}
                    </a>
                  ) : null}
                </div>
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
