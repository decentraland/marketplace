import React, { useEffect } from 'react'
import { Network, NFTCategory } from '@dcl/schemas'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { AuthorizationType, type Authorization as AuthorizationData } from 'decentraland-dapps/dist/modules/authorization/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName } from 'decentraland-transactions'
import { Page, Grid, Blockie, Loader, Form } from 'decentraland-ui'
import copyText from '../../lib/copyText'
import { useTimer } from '../../lib/timer'
import { getContractNames } from '../../modules/vendor'
import { nftMarketplaceAPI as nftAPI } from '../../modules/vendor/decentraland/nft/api'
import { shortenAddress } from '../../modules/wallet/utils'
import { getDeployedOffChainMarketplaceContracts } from '../../utils/trades'
import { PageLayout } from '../PageLayout'
import { Authorization } from './Authorization'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

/**
 * How many of the wallet's collectibles are read to work out which collections to check.
 *
 * Selling approvals are per-collection `setApprovalForAll` grants and nothing indexes them, so the only
 * way to know which collections to ask about is to look at what the wallet holds. One page is enough to
 * cover the collections a seller actually deals in; a wallet holding more than this may not see every
 * approval it granted.
 */
const HELD_COLLECTIBLES_TO_SCAN = 1000

const SettingsPage = (props: Props) => {
  const { wallet, authorizations, isLoading, hasError, hasFetchedContracts, getContract, onFetchContracts, onFetchAuthorizations } = props

  const [hasCopiedText, setHasCopiedAddress] = useTimer(1200)

  useEffect(() => {
    // Only fetch the contracts if they were not already fetched.
    // hasFetchedContracts is reset to false whenever the connected account changes.
    if (!hasFetchedContracts && !isLoading) {
      onFetchContracts()
    }
  }, [onFetchContracts, hasFetchedContracts, isLoading, wallet])

  /**
   * Ask about the selling approvals the wallet may hold, so the section below has something to show.
   *
   * The page renders whatever selling approvals are in the store, but nothing here ever put any there:
   * only the sell and rent flows fetch them, for the one collection they are about, and the store is not
   * persisted. So the section was empty on every visit, and a `setApprovalForAll` granted while listing
   * an item had nowhere to be revoked.
   *
   * These are per-collection grants and nothing indexes them, so which collections to ask about has to be
   * inferred from what the wallet holds. Cheap to over-ask: the saga checks them in a single multicall
   * batch, and only the ones actually granted reach the store, so a collection that was never approved
   * costs a slot in that batch and renders nothing.
   */
  useEffect(() => {
    if (!wallet) {
      return
    }

    let cancelled = false

    const askAboutHeldCollections = async () => {
      const { data } = await nftAPI.fetch({ first: HELD_COLLECTIBLES_TO_SCAN, skip: 0, address: wallet.address })
      if (cancelled) {
        return
      }

      const seen = new Set<string>()
      const held = data.reduce<AuthorizationData[]>((acc, { nft }) => {
        const key = `${nft.contractAddress}-${nft.chainId}`
        if (seen.has(key)) {
          return acc
        }
        seen.add(key)

        // A Polygon wearable or emote is an ERC721CollectionV2; everything else answers as a plain ERC721.
        // Same pairing the sell flow uses, so the row here describes the grant that flow actually made.
        const contractName =
          (nft.category === NFTCategory.WEARABLE || nft.category === NFTCategory.EMOTE) && nft.network === Network.MATIC
            ? ContractName.ERC721CollectionV2
            : ContractName.ERC721

        for (const { contract } of getDeployedOffChainMarketplaceContracts(nft.chainId)) {
          acc.push({
            address: wallet.address,
            authorizedAddress: contract.address,
            contractAddress: nft.contractAddress,
            contractName,
            chainId: nft.chainId,
            type: AuthorizationType.APPROVAL
          })
        }

        return acc
      }, [])

      if (held.length > 0) {
        onFetchAuthorizations(held)
      }
    }

    void askAboutHeldCollections()

    return () => {
      cancelled = true
    }
  }, [wallet, onFetchAuthorizations])

  const contractNames = getContractNames()

  const collectionStore = getContract({
    name: contractNames.COLLECTION_STORE,
    network: Network.MATIC
  })

  let creditsManager
  try {
    creditsManager = getContract({
      name: contractNames.CREDITS_MANAGER,
      network: Network.MATIC
    })
  } catch (error) {
    console.log('Error getting credit manager', error)
  }

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
    <PageLayout>
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
                          {/*
                            One row per DEPLOYED off-chain marketplace version, not just the newest. A grant
                            made against an older version stays live on chain once a newer one ships, and a
                            row is the only way to see or revoke it. Keyed by address so each version keeps
                            its own row identity rather than sharing one with its siblings.
                          */}
                          {getDeployedOffChainMarketplaceContracts(manaEthereum.chainId).map(({ contract }) => (
                            <Authorization
                              key={contract.address}
                              authorization={{
                                address: wallet.address,
                                authorizedAddress: contract.address,
                                contractAddress: manaEthereum.address,
                                contractName: ContractName.MANAToken,
                                chainId: manaEthereum.chainId,
                                type: AuthorizationType.ALLOWANCE
                              }}
                            />
                          ))}
                          {getDeployedOffChainMarketplaceContracts(manaMatic.chainId).map(({ contract }) => (
                            <Authorization
                              key={contract.address}
                              authorization={{
                                address: wallet.address,
                                authorizedAddress: contract.address,
                                contractAddress: manaMatic.address,
                                contractName: ContractName.MANAToken,
                                chainId: manaMatic.chainId,
                                type: AuthorizationType.ALLOWANCE
                              }}
                            />
                          ))}
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
                          {creditsManager && (
                            <Authorization
                              authorization={{
                                address: wallet.address,
                                authorizedAddress: creditsManager.address,
                                contractAddress: manaMatic.address,
                                contractName: ContractName.MANAToken,
                                chainId: manaMatic.chainId,
                                type: AuthorizationType.ALLOWANCE
                              }}
                            />
                          )}
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
    </PageLayout>
  )
}

export default React.memo(SettingsPage)
