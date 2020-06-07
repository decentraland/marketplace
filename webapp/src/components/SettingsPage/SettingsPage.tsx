import React, { useState, useEffect, useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Page, Grid, Blockie, Mana, Loader, Form } from 'decentraland-ui'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { locations } from '../../modules/routing/locations'
import { contractAddresses } from '../../modules/contract/utils'
import { hasAuthorization } from '../../modules/authorization/utils'
import { shortenAddress } from '../../modules/wallet/utils'
import { AuthorizationType } from '../AuthorizationModal/AuthorizationModal.types'
import { Authorization } from './Authorization'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const BUY_MANA_URL = process.env.REACT_APP_BUY_MANA_URL

const SettingsPage = (props: Props) => {
  const {
    wallet,
    authorizations,
    pendingAllowTransactions,
    pendingApproveTransactions,
    isLoadingAuthorization,
    isConnecting,
    onAllowToken,
    onApproveToken,
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
              <Grid.Column computer={4} mobile={16}>
                <div className="left-column secondary-text">
                  {t('global.address')}
                </div>
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
              <Grid.Column computer={4} mobile={16}>
                <div className="left-column secondary-text">
                  {t('global.balance')}
                </div>
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                <div className="balance">
                  <Mana inline>
                    {parseInt(wallet.mana.toFixed(0), 10).toLocaleString()}
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
              <Grid.Column computer={4} mobile={16}>
                <div className="left-column secondary-text">
                  {t('settings_page.authorizations')}
                </div>
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
                            checked={hasAuthorization(
                              authorizations!,
                              contractAddresses.Marketplace,
                              contractAddresses.MANAToken,
                              AuthorizationType.ALLOWANCE
                            )}
                            contractAddress={contractAddresses.Marketplace}
                            tokenContractAddress={contractAddresses.MANAToken}
                            pendingTransactions={pendingAllowTransactions}
                            onChange={onAllowToken}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_bidding')}
                          </label>
                          <Authorization
                            checked={hasAuthorization(
                              authorizations!,
                              contractAddresses.Bids,
                              contractAddresses.MANAToken,
                              AuthorizationType.ALLOWANCE
                            )}
                            contractAddress={contractAddresses.Bids}
                            tokenContractAddress={contractAddresses.MANAToken}
                            pendingTransactions={pendingAllowTransactions}
                            onChange={onAllowToken}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_selling')}
                          </label>

                          {Object.keys(authorizations!.approvals).map(
                            contractAddress => {
                              const privilege = authorizations!.approvals[
                                contractAddress
                              ]
                              return !privilege
                                ? null
                                : Object.keys(
                                    privilege
                                  ).map(tokenContractAddress => (
                                    <Authorization
                                      key={
                                        contractAddress + tokenContractAddress
                                      }
                                      checked={privilege[tokenContractAddress]}
                                      contractAddress={contractAddress}
                                      tokenContractAddress={
                                        tokenContractAddress
                                      }
                                      pendingTransactions={
                                        pendingApproveTransactions
                                      }
                                      onChange={onApproveToken}
                                    />
                                  ))
                            }
                          )}
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
