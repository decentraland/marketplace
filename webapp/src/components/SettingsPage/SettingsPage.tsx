import React, { useState, useEffect, useCallback } from 'react'
// import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Page, Grid, Blockie, Mana, Loader, Form } from 'decentraland-ui'
import CopyToClipboard from 'react-copy-to-clipboard'

import { locations } from '../../modules/routing/locations'
import { contractAddresses } from '../../modules/contract/utils'
import { shortenAddress } from '../../modules/wallet/utils'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Authorization } from './Authorization'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'
import { Network } from '@dcl/schemas'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'

const BUY_MANA_URL = process.env.REACT_APP_BUY_MANA_URL

const SettingsPage = (props: Props) => {
  const {
    wallet,
    authorizations,
    pendingTransactions,
    isLoadingAuthorization,
    isConnecting,
    onGrant,
    onRevoke,
    onNavigate
  } = props

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

  const hasEmptyAuthorizations =
    authorizations === undefined || Object.keys(authorizations).length === 0

  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="SettingsPage">
        {isConnecting ? (
          <Loader size="massive" active />
        ) : wallet ? (
          <Grid>
            <Grid.Row>
              <Grid.Column
                className="left-column secondary-text"
                computer={4}
                mobile={16}
              >
                {t('global.address')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                <div className="blockie-container">
                  <Blockie seed={wallet.address} scale={12} />
                </div>
                <div className="address-container">
                  <div className="address">
                    {isMobile()
                      ? shortenAddress(wallet.address)
                      : wallet.address}
                  </div>
                  <CopyToClipboard text={wallet.address} onCopy={handleOnCopy}>
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
              <Grid.Column
                className="left-column secondary-text"
                computer={4}
                mobile={16}
              >
                {t('global.balance')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                <div className="balance">
                  <Mana inline>
                    {parseInt(
                      wallet.networks[Network.ETHEREUM].mana.toFixed(0),
                      10
                    ).toLocaleString()}
                  </Mana>
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
              <Grid.Column
                className="left-column secondary-text"
                computer={4}
                mobile={16}
              >
                {t('settings_page.authorizations')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                {isLoadingAuthorization ? (
                  <Loader size="massive" active />
                ) : (
                  <div className="authorization-checks-container">
                    {hasEmptyAuthorizations ? (
                      <div className="authorization-checks">
                        <p className="danger-text">
                          {t('settings_page.authorization_error')}
                          <br />
                          {t('settings_page.authorization_error_contact')}
                        </p>
                      </div>
                    ) : (
                      <Form>
                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_buying')}
                          </label>
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: contractAddresses.Marketplace,
                              tokenAddress: contractAddresses.MANAToken,
                              chainId: wallet.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                            pendingTransactions={pendingTransactions}
                            authorizations={authorizations}
                            onGrant={onGrant}
                            onRevoke={onRevoke}
                          />
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress:
                                contractAddresses.MarketplaceAdapter,
                              tokenAddress: contractAddresses.MANAToken,
                              chainId: wallet.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                            authorizations={authorizations}
                            pendingTransactions={pendingTransactions}
                            onGrant={onGrant}
                            onRevoke={onRevoke}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_bidding')}
                          </label>
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: contractAddresses.Bids,
                              tokenAddress: contractAddresses.MANAToken,
                              chainId: wallet.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                            pendingTransactions={pendingTransactions}
                            authorizations={authorizations}
                            onGrant={onGrant}
                            onRevoke={onRevoke}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_selling')}
                          </label>

                          {authorizations.map(authorization => {
                            return (
                              <Authorization
                                key={
                                  authorization.authorizedAddress +
                                  authorization.tokenAddress
                                }
                                authorization={authorization}
                                pendingTransactions={pendingTransactions}
                                authorizations={authorizations}
                                onGrant={onGrant}
                                onRevoke={onRevoke}
                              />
                            )
                          })}
                        </div>
                      </Form>
                    )}
                  </div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SettingsPage)
