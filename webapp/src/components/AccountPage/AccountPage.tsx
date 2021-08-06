import React, { useEffect } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Page, Loader } from 'decentraland-ui'
import { Icon } from 'semantic-ui-react'
import { Profile } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { View } from '../../modules/ui/types'
import { useTimer } from '../../lib/timer'
import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { AssetBrowse } from '../AssetBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { locations } from '../../modules/routing/locations'
import { Props } from './AccountPage.types'
import { Column } from '../Layout/Column'
import './AccountPage.css'

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

  const [hasCopiedAddress, setHasCopiedAddress] = useTimer(1200)
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
          <AssetBrowse
            vendor={vendor}
            address={wallet.address}
            view={View.ACCOUNT}
            isFullscreen={Boolean(isFullscreen)}
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
                <div className="profile-address-hash">{address}</div>
                {!isMobile() && (
                  <div>
                    <CopyToClipboard
                      text={address}
                      onCopy={setHasCopiedAddress}
                    >
                      <Icon
                        aria-label="Copy address"
                        aria-hidden="false"
                        className="copy"
                        name="copy outline"
                      />
                    </CopyToClipboard>
                    {hasCopiedAddress && (
                      <span className="profile-copied-text-desktop copied">
                        {t('account_page.copied')}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {isMobile() && (
                <div className="profile-copy-text-mobile">
                  <CopyToClipboard text={address} onCopy={setHasCopiedAddress}>
                    {hasCopiedAddress ? (
                      <span className="copied">
                        {t('account_page.copied_capitalized')}
                      </span>
                    ) : (
                      <span className="copy">
                        {t('account_page.copy_address')}
                      </span>
                    )}
                  </CopyToClipboard>
                </div>
              )}
            </Column>
          </PageHeader>

          <AssetBrowse
            vendor={vendor}
            address={address}
            view={View.ACCOUNT}
            isFullscreen={Boolean(isFullscreen)}
          />
        </>
      ) : null}
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
