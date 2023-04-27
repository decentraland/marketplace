import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from 'decentraland-ui'
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
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onRedirect(locations.signIn(`${pathname}${search}`))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting, wallet, onRedirect])

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_LISTS} />
      <Header className={styles.header} size="large">
        {/* TODO: use the name of the selected list */}
        {t('lists_page.default_title')}
      </Header>
      <AssetBrowse
        view={View.LISTS}
        section={Section.LISTS}
        vendor={VendorName.DECENTRALAND}
      />
      <Footer />
    </>
  )
}

export default React.memo(ListsPage)
