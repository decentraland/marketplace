import React, { useEffect, useState } from 'react'

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
import { builderAPI } from '../../modules/vendor/decentraland/builder/api'

const MVMFTag = 'MVMF22'

const MVMFPage = (props: Props) => {
  const { isFullscreen, section } = props
  const vendor = isVendor(props.vendor) ? props.vendor : VendorName.DECENTRALAND
  const [contractAddresses, setContractAddresses] = useState<string[]>()

  useEffect(() => {
    ;(async () => {
      const { addresses } = await builderAPI.fetchAddressesByTag([MVMFTag])
      setContractAddresses(addresses)
    })()
  })

  const activeTab = NavigationTab.MVMF

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={activeTab} isFullscreen={isFullscreen} />
      <AssetBrowse
        vendor={vendor}
        isFullscreen={Boolean(isFullscreen)}
        view={View.MARKET}
        section={section}
        sections={[Section.WEARABLES, Section.EMOTES, Section.ENS]}
        contracts={contractAddresses}
      />
      <Footer isFullscreen={isFullscreen} />
    </>
  )
}

export default React.memo(MVMFPage)
