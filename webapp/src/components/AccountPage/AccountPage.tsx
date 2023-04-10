import { AddressProvider } from 'decentraland-dapps/dist/containers/AddressProvider'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Center, Loader, Page } from 'decentraland-ui'
import React from 'react'
import { useRequireConnect } from '../../customHooks/useRequireConnect'
import { View } from '../../modules/ui/types'
import { AssetBrowse } from '../AssetBrowse'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import AccountBanner from './AccountBanner'
import './AccountPage.css'
import { Props } from './AccountPage.types'

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
