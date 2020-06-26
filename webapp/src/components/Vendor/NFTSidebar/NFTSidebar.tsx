import React, { useCallback } from 'react'

import { Section } from '../../../modules/routing/search'
import { Vendors } from '../../../modules/vendor/types'
import { useNavigate } from '../../../modules/nft/hooks'
import { NFTSidebar as DecentralandNFTSidebar } from '../decentraland/NFTSidebar'
import { NFTSidebar as SuperRareNFTSidebar } from '../super_rare/NFTSidebar'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { section, vendor } = props
  const [navigate] = useNavigate()

  const handleOnNavigate = useCallback(
    (section: Section) => {
      navigate({ section: section })
    },
    [navigate]
  )

  switch (vendor) {
    case Vendors.SUPER_RARE:
      return (
        <SuperRareNFTSidebar
          vendor={vendor}
          onMenuItemClick={handleOnNavigate}
        />
      )
    case Vendors.DECENTRALAND:
    default:
      return (
        <DecentralandNFTSidebar
          section={section}
          onMenuItemClick={handleOnNavigate}
        />
      )
  }
}

export default React.memo(NFTSidebar)
