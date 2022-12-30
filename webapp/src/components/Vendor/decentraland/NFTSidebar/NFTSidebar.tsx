import React from 'react'
import { FiltersSidebar } from '../../../FiltersSidebar'
import { NFTSections } from '../NFTSections'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, sections, onMenuItemClick } = props

  return (
    <div className="NFTSidebar">
      <NFTSections
        section={section}
        sections={sections}
        onSectionClick={onMenuItemClick}
      />
      <FiltersSidebar />
    </div>
  )
}

export default React.memo(NFTSidebar)
