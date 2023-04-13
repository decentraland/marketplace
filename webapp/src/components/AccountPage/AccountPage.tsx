import React from 'react'
import { Page, Loader, Center } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AddressProvider } from 'decentraland-dapps/dist/containers/AddressProvider'
import { View } from '../../modules/ui/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { AssetBrowse } from '../AssetBrowse'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './AccountPage.types'
import AccountBanner from './AccountBanner'
import { useRequireConnect } from '../../customHooks/useRequireConnect'
import './AccountPage.css'

const AccountPage = ({
  addressInUrl,
  vendor,
  wallet,
  isConnecting,
  isFullscreen,
  viewAsGuest,
  onRedirect
}: Props) => {
  const isCurrentAccount =
    (!addressInUrl || wallet?.address === addressInUrl) && !viewAsGuest

  useRequireConnect({ addressInUrl, wallet, isConnecting, onRedirect })

  return (
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation
        activeTab={isCurrentAccount ? NavigationTab.MY_STORE : undefined}
      />
      <AddressProvider input={addressInUrl || wallet?.address || ''}>
        {({ address, isLoading, error }) => (
          <>
            {isLoading || isConnecting ? (
              <Page>
                <Loader size="massive" active />
              </Page>
            ) : error ? (
              <Page>
                <Center>
                  <p className="secondary-text">{t(`address.${error}`)}</p>
                </Center>
              </Page>
            ) : address ? (
              <>
                {!isCurrentAccount ? <AccountBanner address={address} /> : null}
                <AssetBrowse
                  vendor={vendor}
                  address={address}
                  view={isCurrentAccount ? View.CURRENT_ACCOUNT : View.ACCOUNT}
                />
              </>
            ) : null}
          </>
        )}
      </AddressProvider>
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(AccountPage)
