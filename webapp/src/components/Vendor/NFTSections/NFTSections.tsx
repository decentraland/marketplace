import React from 'react'

import { Vendors } from '../../../modules/vendor/types'
import { Section } from '../../../modules/vendor/routing/types'
import { Section as KnownOriginSection } from '../../../modules/vendor/known_origin/routing/types'
import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { NFTSections as KnownOriginNFTSections } from '../known_origin/NFTSections'
import { NFTSections as DecentralandNFTSections } from '../decentraland/NFTSections'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'

import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { vendor, address, section, onSectionClick } = props

  // TODO: This should be on a generic path like PartnerSidebar
  switch (vendor) {
    case Vendors.SUPER_RARE:
    case Vendors.MAKERS_PLACE:
      const all = Section[vendor].ALL
      return (
        <Menu className="NFTSections">
          <MenuItem
            value={all}
            currentValue={section}
            onClick={onSectionClick}
          />
        </Menu>
      )
    case Vendors.KNOWN_ORIGIN:
      return (
        <KnownOriginNFTSections
          section={section as KnownOriginSection}
          address={address}
          onSectionClick={onSectionClick}
        />
      )
    case Vendors.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSections
          section={section as DecentralandSection}
          onSectionClick={onSectionClick}
        />
      )
  }
}

export default React.memo(NFTSections)
