import React, { useEffect } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Page, Loader, Popup } from 'decentraland-ui'
import { Icon } from 'semantic-ui-react'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { shortenAddress } from '../../modules/wallet/utils'
import { View } from '../../modules/ui/types'
import { useTimer } from '../../lib/timer'
import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { NFTBrowse } from '../NFTBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { Props } from './AccountPage.types'
import { Column } from '../Layout/Column'
import './AccountPage.css'

const ShortenedAddress = (address: string) => {
  return <div className="profile-address-hash">{shortenAddress(address)}</div>
}

const AccountPage = (props: Props) => {
  const {
    address,
    vendor,
    wallet,
    isConnecting,
    onRedirect,
    isFullscreen
  } = props

  const isCurrentAccount =
    address === undefined || (wallet && wallet.address === address)

  const [hasCopiedAddress, handleCopying] = useTimer(1200)
  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (isCurrentAccount && !isConnecting && !wallet) {
      onRedirect(locations.signIn())
    }
  }, [isCurrentAccount, isConnecting, wallet, onRedirect])

  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation
        isFullscreen={!isCurrentAccount || isFullscreen}
        activeTab={isCurrentAccount ? NavigationTab.MY_ASSETS : undefined}
      />
      {isCurrentAccount ? (
        isConnecting || !wallet ? (
          <Page>
            <Loader size="massive" active />
          </Page>
        ) : (
          <NFTBrowse
            vendor={vendor}
            address={wallet.address}
            view={View.ACCOUNT}
          />
        )
      ) : address !== undefined ? (
        <>
          <PageHeader>
            <Column>
              <Profile
                address={address}
                size="massive"
                imageOnly
                inline={false}
              />
              <div className="profile-name">
                <Profile address={address} textOnly inline={false} />
              </div>
              <div className="profile-address">
                <Popup
                  content={address}
                  position="bottom center"
                  trigger={ShortenedAddress(address)}
                  on="hover"
                />
                <div>
                  <CopyToClipboard text={address} onCopy={handleCopying}>
                    <Icon
                      aria-label="Copy address"
                      aria-hidden="false"
                      className="profile-address-copy-icon"
                      name="copy outline"
                    />
                  </CopyToClipboard>
                  {hasCopiedAddress && (
                    <span className="profile-address-copied-text">
                      {t('account_page.copied')}
                    </span>
                  )}
                </div>
              </div>
            </Column>
          </PageHeader>

          <NFTBrowse vendor={vendor} address={address} view={View.ACCOUNT} />
        </>
      ) : null}
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
