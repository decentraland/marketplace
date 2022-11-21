import React, { useEffect } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Network, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { Page, Grid, Blockie, Loader, Form } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'

import { locations } from '../../modules/routing/locations'
import { Contract } from '../../modules/vendor/services'
import { shortenAddress } from '../../modules/wallet/utils'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Authorization } from './Authorization'
import { getContractNames } from '../../modules/vendor'
import { useTimer } from '../../lib/timer'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const SettingsPage = (props: Props) => {
  const {
    wallet,
    authorizations,
    isLoadingAuthorization,
    isConnecting,
    hasError,
    getContract,
    onNavigate
  } = props

  const [hasCopiedText, setHasCopiedAddress] = useTimer(1200)

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onNavigate(locations.signIn())
    }
  }, [isConnecting, wallet, onNavigate])

  const contractNames = getContractNames()

  const marketplaceEthereum = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.ETHEREUM
  })

  const marketplaceMatic = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.MATIC
  })

  const bids = getContract({
    name: contractNames.BIDS
  })

  const manaEthereum = getContract({
    name: contractNames.MANA,
    network: Network.ETHEREUM
  })

  const manaMatic = getContract({
    name: contractNames.MANA,
    network: Network.MATIC
  })

  if (
    !marketplaceEthereum ||
    !marketplaceMatic ||
    !bids ||
    !manaEthereum ||
    !manaMatic
  ) {
    return null
  }

  let rentals: Contract | null

  try {
    rentals = getContract({
      name: getContractNames().RENTALS,
      network: Network.ETHEREUM
    })
  } catch (error) {}

  const authorizationsForSelling = authorizations.filter(authorization => {
    const contract = getContract({ address: authorization.contractAddress })
    return rentals
      ? !!contract &&
          contract.category !== null &&
          authorization.authorizedAddress !== rentals.address
      : !!contract && contract.category !== null
  })

  const authorizationsForRenting = authorizations.filter(authorization => {
    const contract = getContract({ address: authorization.contractAddress })
    return (
      !!contract &&
      (contract.category === NFTCategory.PARCEL ||
        contract.category === NFTCategory.ESTATE) &&
        rentals &&
        authorization.authorizedAddress === rentals.address
    )
  })

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
                  <CopyToClipboard
                    text={wallet.address}
                    onCopy={setHasCopiedAddress}
                  >
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
                {t('settings_page.authorizations')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                {isLoadingAuthorization ? (
                  <Loader size="massive" active />
                ) : (
                  <div className="authorization-checks-container">
                    {hasError ? (
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
                              authorizedAddress: marketplaceEthereum.address,
                              contractAddress: manaEthereum.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaEthereum.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: marketplaceMatic.address,
                              contractAddress: manaMatic.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaMatic.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">
                            {t('settings_page.for_bidding')}
                          </label>
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: bids.address,
                              contractAddress: manaEthereum.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaEthereum.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                        </div>

                        {authorizationsForSelling.length > 0 ? (
                          <div className="authorization-checks">
                            <label className="secondary-text">
                              {t('settings_page.for_selling')}
                            </label>

                            {authorizationsForSelling.map(authorization => {
                              return (
                                <Authorization
                                  key={
                                    authorization.authorizedAddress +
                                    authorization.contractAddress
                                  }
                                  authorization={authorization}
                                />
                              )
                            })}
                          </div>
                        ) : null}

                        {authorizationsForRenting.length > 0 ? (
                          <div className="authorization-checks">
                            <label className="secondary-text">
                              {t('settings_page.for_renting')}
                            </label>

                            {authorizationsForRenting.map(authorization => {
                              return (
                                <Authorization
                                  key={
                                    authorization.authorizedAddress +
                                    authorization.contractAddress
                                  }
                                  authorization={authorization}
                                />
                              )
                            })}
                          </div>
                        ) : null}
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
