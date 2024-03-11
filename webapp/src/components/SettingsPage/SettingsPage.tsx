import React, { useEffect } from 'react'
import { Network, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { Page, Grid, Blockie, Loader, Form } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'

import { shortenAddress } from '../../modules/wallet/utils'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Authorization } from './Authorization'
import { getContractNames } from '../../modules/vendor'
import { useTimer } from '../../lib/timer'
import { Props } from './SettingsPage.types'
import copyText from '../../lib/copyText'
import './SettingsPage.css'

const SettingsPage = (props: Props) => {
  const { wallet, authorizations, isLoading, hasError, hasFetchedContracts, getContract, onFetchContracts } = props

  const [hasCopiedText, setHasCopiedAddress] = useTimer(1200)

  useEffect(() => {
    // Only fetch the contracts if they were not already fetched.
    // hasFetchedContracts is reset to false whenever the connected account changes.
    if (!hasFetchedContracts && !isLoading) {
      onFetchContracts()
    }
  }, [onFetchContracts, hasFetchedContracts, isLoading, wallet])

  const contractNames = getContractNames()

  const collectionStore = getContract({
    name: contractNames.COLLECTION_STORE,
    network: Network.MATIC
  })

  const marketplaceEthereum = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.ETHEREUM
  })

  const marketplaceMatic = getContract({
    name: contractNames.MARKETPLACE,
    network: Network.MATIC
  })

  const bidsEthereum = getContract({
    name: contractNames.BIDS,
    network: Network.ETHEREUM
  })

  const bidsMatic = getContract({
    name: contractNames.BIDS,
    network: Network.MATIC
  })

  const manaEthereum = getContract({
    name: contractNames.MANA,
    network: Network.ETHEREUM
  })

  const manaMatic = getContract({
    name: contractNames.MANA,
    network: Network.MATIC
  })

  const rentals = getContract({
    name: contractNames.RENTALS,
    network: Network.ETHEREUM
  })

  // These contracts are defined in initialization with the redux store, so they should always be defined.
  // If the settings is shown as blank it's because there is some sort of misconfiguration that should be addressed.
  if (
    !collectionStore ||
    !marketplaceEthereum ||
    !marketplaceMatic ||
    !bidsEthereum ||
    !bidsMatic ||
    !manaEthereum ||
    !manaMatic ||
    !rentals
  ) {
    return null
  }

  const authorizationsForSelling = authorizations.filter(authorization => {
    const contract = getContract({ address: authorization.contractAddress })

    return (
      contract &&
      contract.category !== null &&
      authorization.authorizedAddress !== rentals.address &&
      wallet &&
      authorization.address === wallet.address
    )
  })

  const authorizationsForRenting = authorizations.filter(authorization => {
    const contract = getContract({ address: authorization.contractAddress })

    if (!contract) {
      return false
    }

    const isParcelOrEstate = contract.category === NFTCategory.PARCEL || contract.category === NFTCategory.ESTATE

    return (
      contract &&
      isParcelOrEstate &&
      authorization.authorizedAddress === rentals.address &&
      wallet &&
      authorization.address === wallet.address
    )
  })

  return (
    <>
      <Navbar />
      <Navigation />
      <Page className="SettingsPage">
        {wallet ? (
          <Grid>
            <Grid.Row>
              <Grid.Column className="left-column secondary-text" computer={4} mobile={16}>
                {t('global.address')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                <div className="blockie-container">
                  <Blockie seed={wallet.address} scale={12} />
                </div>
                <div className="address-container">
                  <div className="address">{isMobile() ? shortenAddress(wallet.address) : wallet.address}</div>
                  <div role="button" aria-label="copy" onClick={() => copyText(wallet.address, setHasCopiedAddress)}>
                    {hasCopiedText ? (
                      <span className="copy-text">{t('settings_page.copied')}</span>
                    ) : (
                      <span className="copy-text link">{t('settings_page.copy_address')}</span>
                    )}
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className="left-column secondary-text" computer={4} mobile={16}>
                {t('settings_page.authorizations')}
              </Grid.Column>
              <Grid.Column computer={12} mobile={16}>
                {isLoading ? (
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
                          <label className="secondary-text">{t('settings_page.for_buying')}</label>
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
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: collectionStore.address,
                              contractAddress: manaMatic.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaMatic.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">{t('settings_page.for_bidding')}</label>
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: bidsEthereum.address,
                              contractAddress: manaEthereum.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaEthereum.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: bidsMatic.address,
                              contractAddress: manaMatic.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaMatic.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                        </div>

                        <div className="authorization-checks">
                          <label className="secondary-text">{t('settings_page.for_renting')}</label>
                          <Authorization
                            authorization={{
                              address: wallet.address,
                              authorizedAddress: rentals.address,
                              contractAddress: manaEthereum.address,
                              contractName: ContractName.MANAToken,
                              chainId: manaEthereum.chainId,
                              type: AuthorizationType.ALLOWANCE
                            }}
                          />
                          {authorizationsForRenting.map(authorization => {
                            return (
                              <Authorization
                                key={authorization.authorizedAddress + authorization.contractAddress}
                                authorization={authorization}
                              />
                            )
                          })}
                        </div>

                        {authorizationsForSelling.length > 0 ? (
                          <div className="authorization-checks">
                            <label className="secondary-text">{t('settings_page.for_selling')}</label>

                            {authorizationsForSelling.map(authorization => {
                              return (
                                <Authorization
                                  key={authorization.authorizedAddress + authorization.contractAddress}
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
