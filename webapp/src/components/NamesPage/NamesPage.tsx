import React from 'react'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/decentraland'
import { VendorName } from '../../modules/vendor/types'
import { AssetBrowse } from '../AssetBrowse'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'

const NamesPage = () => {
  return (
    <PageLayout activeTab={NavigationTab.NAMES}>
      <AssetBrowse vendor={VendorName.DECENTRALAND} view={View.MARKET} section={Section.ENS} sections={[Section.ENS]} />
    </PageLayout>
  )
}

export default React.memo(NamesPage)
