import React from 'react'

import { Vendors } from '../../../modules/vendor/types'
import { NFTSections as DecentralandNFTSections } from '../decentraland/NFTSections'
import { NFTSections as SuperRareNFTSections } from '../super_rare/NFTSections'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { vendor, section, onSectionClick } = props

  switch (vendor) {
    case Vendors.SUPER_RARE:
    case Vendors.MAKERS_PLACE:
      return (
        <SuperRareNFTSections
          section={section}
          onSectionClick={onSectionClick}
        />
      )
    case Vendors.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSections
          section={section}
          onSectionClick={onSectionClick}
        />
      )
  }
}

export default React.memo(NFTSections)
