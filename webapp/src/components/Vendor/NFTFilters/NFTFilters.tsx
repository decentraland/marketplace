import React from 'react'

import { Vendors } from '../../../modules/vendor/types'
import { NFTFilters as DecentralandNFTFilters } from '../decentraland/NFTFilters'
import { NFTFilters as SuperRareNFTFilters } from '../super_rare/NFTFilters'
import { NFTFilters as MakersPlaceNFTFilters } from '../makers_place/NFTFilters'
import { NFTFilters as KnownOriginNFTFilters } from '../known_origin/NFTFilters'
import { Props } from './NFTFilters.types'
import './NFTFilters.css'

// TODO: Code on each NFTFilters can be extracted
const NFTFilters = (props: Props) => {
  const { vendor, onBrowse } = props

  switch (vendor) {
    case Vendors.SUPER_RARE:
      return <SuperRareNFTFilters onBrowse={onBrowse} />
    case Vendors.MAKERS_PLACE:
      return <MakersPlaceNFTFilters onBrowse={onBrowse} />
    case Vendors.KNOWN_ORIGIN:
      return <KnownOriginNFTFilters onBrowse={onBrowse} />
    case Vendors.DECENTRALAND:
    default:
      return <DecentralandNFTFilters onBrowse={onBrowse} />
  }
}

export default React.memo(NFTFilters)
