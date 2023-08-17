import React, { useCallback } from 'react'
import { getMarketAssetTypeFromCategory, getCategoryFromSection } from '../../../modules/routing/search'
import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { Sections } from '../../../modules/vendor/routing/types'
import { VendorName } from '../../../modules/vendor/types'
import { NFTSidebar as DecentralandNFTSidebar } from '../decentraland/NFTSidebar'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { vendor, section, sections, onBrowse, search } = props

  const handleOnBrowse = useCallback(
    (section: string) => {
      const category = getCategoryFromSection(section)
      onBrowse({
        search,
        section,
        assetType: category ? getMarketAssetTypeFromCategory(category) : undefined
      })
    },
    [onBrowse, search]
  )

  switch (vendor) {
    case VendorName.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSidebar
          section={section as DecentralandSection}
          sections={(sections as DecentralandSection[]) ?? [Sections.decentraland.ALL]}
          onMenuItemClick={handleOnBrowse}
          onBrowse={onBrowse}
        />
      )
  }
}

export default React.memo(NFTSidebar)
