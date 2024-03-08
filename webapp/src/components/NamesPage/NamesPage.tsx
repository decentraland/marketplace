import React from 'react'
import { VendorName } from '../../modules/vendor/types'
import { View } from '../../modules/ui/types'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Section } from '../../modules/vendor/decentraland'
import { AssetBrowse } from '../AssetBrowse'
import { PageLayout } from '../PageLayout'

const NamesPage = () => {
  return (
    <PageLayout activeTab={NavigationTab.NAMES}>
      <AssetBrowse vendor={VendorName.DECENTRALAND} view={View.MARKET} section={Section.ENS} sections={[Section.ENS]} />
    </PageLayout>
  )
}

export default React.memo(NamesPage)
