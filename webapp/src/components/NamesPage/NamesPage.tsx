import React from 'react'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Section } from '../../modules/vendor/decentraland'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { Props } from './NamesPage.types'
import styles from './NamesPage.module.css'

const NamesPage = (props: Props) => {
  const { isFullscreen } = props
  return (
    <div className={styles.namesPageContainer}>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.NAMES} />
      <AssetBrowse
        vendor={VendorName.DECENTRALAND}
        view={View.MARKET}
        section={Section.ENS}
        sections={[Section.ENS]}
      />
      <Footer isFullscreen={isFullscreen} />
    </div>
  )
}

export default React.memo(NamesPage)
