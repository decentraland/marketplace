import React, { useEffect } from 'react'
import { Page, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/decentraland'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './ListsPage.types'
import styles from './ListsPage.module.css'

const ListsPage = ({ wallet, isConnecting, onRedirect }: Props) => {
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
      <Page>
        <Header sub className={styles.back}>
          {/* TODO: use it on V1 */}
          {/* <a href={locations.lists()}>{`< ${t('global.back')}`}</a> */}
        </Header>
        <Header size="large">
          {/* TODO: use the name of the selected list */}
          {t('lists_page.default_title')}
        </Header>
        <AssetBrowse
          view={View.LISTS}
          section={Section.LISTS}
          vendor={VendorName.DECENTRALAND}
          isFullscreen
        />
      </Page>
      <Footer isFullscreen />
    </div>
  )
}

export default React.memo(ListsPage)
