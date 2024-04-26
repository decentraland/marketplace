import React from 'react'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor/types'
import { AssetBrowse } from '../AssetBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'

const LandsPage = () => {
  return (
    <PageLayout activeTab={NavigationTab.LANDS}>
      <AssetBrowse vendor={VendorName.DECENTRALAND} view={View.MARKET} sections={[Section.LAND]} />
    </PageLayout>
  )
}

export default React.memo(LandsPage)
