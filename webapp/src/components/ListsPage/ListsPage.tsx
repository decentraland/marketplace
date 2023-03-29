import React, { useEffect } from 'react'
import { Page, Loader, Center, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AddressProvider } from 'decentraland-dapps/dist/containers/AddressProvider'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './ListsPage.types'
import styles from './ListsPage.module.css'

const ListsPage = ({
  wallet,
  isConnecting,
  isFullscreen,
  onRedirect
}: Props) => {
  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!isConnecting && !wallet) {
      onRedirect(locations.signIn())
    }
  }, [isConnecting, wallet, onRedirect])

  return (
    <div className={styles.ListsPage}>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_LISTS} />
      <AddressProvider input={wallet?.address || ''}>
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
              <Page>
                <Header sub className={styles.back}>
                  <a href={locations.lists()}>{`< ${t('global.back')}`}</a>
                </Header>
                <Header size="large">
                  {/* TODO: use the name of the selected list */}
                  Favorites
                </Header>
                {'count'} items
                <AssetBrowse
                  view={View.LISTS}
                  vendor={VendorName.DECENTRALAND}
                />
              </Page>
            ) : null}
          </>
        )}
      </AddressProvider>
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(ListsPage)
