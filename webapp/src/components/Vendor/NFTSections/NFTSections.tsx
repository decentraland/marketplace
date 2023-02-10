import React from 'react'
import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { Sections } from '../../../modules/vendor/routing/types'
import { VendorName } from '../../../modules/vendor/types'
import { NFTSections as DecentralandNFTSections } from '../decentraland/NFTSections'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { vendor, section, onSectionClick } = props

  // TODO: This should be on a generic path like PartnerSidebar
  switch (vendor) {
    case VendorName.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSections
          section={section as DecentralandSection}
          sections={[Sections.decentraland.ALL]}
          onSectionClick={onSectionClick}
        />
      )
  }
}

export default React.memo(NFTSections)
