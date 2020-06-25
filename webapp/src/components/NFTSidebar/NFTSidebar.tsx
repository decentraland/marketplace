import React, { useCallback } from 'react'

import { Section } from '../../modules/routing/search'
import { Vendors } from '../../modules/vendor/types'
import { useNavigate } from '../../modules/nft/hooks'
import { CategoriesSidebar } from './CategoriesSidebar'
import { PartnerSidebar } from './PartnerSidebar'
import { Props } from './NFTSidebar.types'
import './PartnerSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, vendor } = props
  const [navigate] = useNavigate()

  const handleOnNavigate = useCallback(
    (section: Section) => {
      navigate({ section: section })
    },
    [navigate]
  )

  let Sidebar = null
  switch (vendor) {
    case Vendors.SUPER_RARE:
      Sidebar = (
        <PartnerSidebar vendor={vendor} onMenuItemClick={handleOnNavigate} />
      )
      break
    case Vendors.DECENTRALAND:
    default:
      Sidebar = (
        <CategoriesSidebar
          section={section}
          onMenuItemClick={handleOnNavigate}
        />
      )
      break
  }

  return Sidebar
}

export default React.memo(NFTSidebar)
