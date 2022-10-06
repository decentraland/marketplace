import React, { useEffect } from 'react'

import { isVendor } from '../../modules/vendor/utils'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AssetBrowse } from '../AssetBrowse'
import { Props } from './MVMFPage.types'

const MVMFTag = 'MVMF22'

const MVMFPage = (props: Props) => {
  const { isFullscreen, section, contracts, fetchEventContracts } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND

  useEffect(() => {
    fetchEventContracts(MVMFTag)
  }, [fetchEventContracts])

  const activeTab = NavigationTab.MVMF

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={activeTab} isFullscreen={isFullscreen} />
      {contracts ? (
        <AssetBrowse
          vendor={vendor}
          isFullscreen={Boolean(isFullscreen)}
          view={View.MARKET}
          section={section}
          sections={[Section.WEARABLES, Section.EMOTES]}
          contracts={contracts[MVMFTag]}
        />
      ) : null}
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(MVMFPage)
