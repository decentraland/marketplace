import React, { useCallback } from 'react'

import { Sections } from '../../../modules/vendor/routing/types'
import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { VendorName } from '../../../modules/vendor/types'
import { NFTSidebar as DecentralandNFTSidebar } from '../decentraland/NFTSidebar'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { vendor, section, sections, onBrowse } = props

  const handleOnBrowse = useCallback(
    (section: string) => {
      onBrowse({ section })
    },
    [onBrowse]
  )

  switch (vendor) {
    case VendorName.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSidebar
          section={section as DecentralandSection}
          sections={
            (sections as DecentralandSection[]) ?? [Sections.decentraland.ALL]
          }
          onMenuItemClick={handleOnBrowse}
          onBrowse={onBrowse}
        />
      )
  }
}

export default React.memo(NFTSidebar)
