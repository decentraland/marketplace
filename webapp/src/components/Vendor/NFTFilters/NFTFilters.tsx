import React from 'react'

import { VendorName } from '../../../modules/vendor/types'
import { NFTFilters as DecentralandNFTFilters } from '../decentraland/NFTFilters'
import { Props } from './NFTFilters.types'
import './NFTFilters.css'

// TODO: Code on each NFTFilters can be extracted
const NFTFilters = (props: Props) => {
  const { vendor, contracts, isMap, onBrowse } = props

  switch (vendor) {
    case VendorName.DECENTRALAND:
    default:
      return (
        <DecentralandNFTFilters
          isMap={isMap}
          availableContracts={contracts}
          onBrowse={onBrowse}
        />
      )
  }
}

export default React.memo(NFTFilters)
