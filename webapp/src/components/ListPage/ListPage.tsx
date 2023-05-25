import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
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
import { Props } from './ListPage.types'
import styles from './ListPage.module.css'

const ListPage = ({ wallet, isConnecting, onRedirect }: Props) => {
  // Redirect to signIn if trying to access current account without a wallet
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onRedirect(locations.signIn(`${pathname}${search}`))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnecting, wallet, onRedirect])

  return (
    <div className={styles.page}>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_LISTS} />
      <Header className={styles.header} size="large">
        {/* TODO: use the name of the selected list */}
        {t('list_page.default_title')}
      </Header>
      <div className={classNames(wallet ? null : styles.flexContainer)}>
        {wallet ? (
          <AssetBrowse
            view={View.LISTS}
            section={Section.LISTS}
            vendor={VendorName.DECENTRALAND}
          />
        ) : (
          <div className={styles.emptyState}></div>
        )}
        <Footer className={styles.footer} />
      </div>
    </div>
  )
}

export default React.memo(ListPage)
