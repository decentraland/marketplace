import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header, useNotMobileMediaQuery } from 'decentraland-ui'

import { isLandSection } from '../../../../modules/ui/utils'
import { NFTSections } from '../NFTSections'
import { NFTLandFilters } from '../NFTLandFilters'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, sections, onMenuItemClick, isRentalsEnabled } = props
  const isNotMobile = useNotMobileMediaQuery()

  return (
    <div className="NFTSidebar">
      <Header sub>{t('nft_sidebar.categories')}</Header>
      <NFTSections
        section={section}
        sections={sections}
        onSectionClick={onMenuItemClick}
      />
      {isRentalsEnabled && isLandSection(section) && isNotMobile ? (
        <NFTLandFilters />
      ) : null}
    </div>
  )
}

export default React.memo(NFTSidebar)
