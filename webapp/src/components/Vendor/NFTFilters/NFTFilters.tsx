import React from 'react'

import { Vendors } from '../../../modules/vendor/types'
import { NFTFilters as DecentralandNFTFilters } from '../decentraland/NFTFilters'
import { NFTFilters as SuperRareNFTFilters } from '../super_rare/NFTFilters'
import { Props } from './NFTFilters.types'
import './NFTFilters.css'

const NFTFilters = (props: Props) => {
  const { vendor } = props

  switch (vendor) {
    case Vendors.SUPER_RARE:
      return <SuperRareNFTFilters />
    case Vendors.DECENTRALAND:
    default:
      return <DecentralandNFTFilters />
  }
}

export default React.memo(NFTFilters)
