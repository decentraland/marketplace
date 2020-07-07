import React, { useCallback } from 'react'

import { Section } from '../../../modules/routing/types'
import { Vendors } from '../../../modules/vendor/types'
import { NFTSidebar as DecentralandNFTSidebar } from '../decentraland/NFTSidebar'
import { NFTSidebar as SuperRareNFTSidebar } from '../super_rare/NFTSidebar'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { vendor, section, onBrowse } = props

  const handleOnBrowse = useCallback(
    (section: Section) => {
      onBrowse({ section })
    },
    [onBrowse]
  )

  switch (vendor) {
    case Vendors.SUPER_RARE:
      return (
        <SuperRareNFTSidebar
          section={section}
          onMenuItemClick={handleOnBrowse}
        />
      )
    case Vendors.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSidebar
          section={section}
          onMenuItemClick={handleOnBrowse}
        />
      )
  }
}

export default React.memo(NFTSidebar)
