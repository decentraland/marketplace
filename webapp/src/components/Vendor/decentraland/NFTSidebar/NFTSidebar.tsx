import React from 'react'
import { useNotMobileMediaQuery } from 'decentraland-ui'
import { isLandSection } from '../../../../modules/ui/utils'
import { FiltersSidebar } from '../../../FiltersSidebar'
import { NFTSections } from '../NFTSections'
import { NFTLandFilters } from '../NFTLandFilters'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, sections, onMenuItemClick, isRentalsEnabled } = props
  const isNotMobile = useNotMobileMediaQuery()

  return (
    <div className="NFTSidebar">
      <NFTSections
        section={section}
        sections={sections}
        onSectionClick={onMenuItemClick}
      />
      <FiltersSidebar />
      {isRentalsEnabled && isLandSection(section) && isNotMobile ? (
        <NFTLandFilters />
      ) : null}
    </div>
  )
}

export default React.memo(NFTSidebar)
