import React from 'react'
import { Menu } from '../../../Menu'
import { Props } from './NFTSections.types'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'

const NFTSections = (props: Props) => {
  return (
    <Menu className="NFTSections">
      <NFTSectionsMenuItems {...props} />
    </Menu>
  )
}

export default React.memo(NFTSections)
