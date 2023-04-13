import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header, Page } from 'decentraland-ui'
import { useRequireConnect } from '../../customHooks/useRequireConnect'
import { View } from '../../modules/ui/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/decentraland'
import { AssetBrowse } from '../AssetBrowse'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import styles from './ListsPage.module.css'
import { Props } from './ListsPage.types'

const ListsPage = ({ wallet, isConnecting, onRedirect }: Props) => {
  useRequireConnect({ isConnecting, wallet, onRedirect })

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
