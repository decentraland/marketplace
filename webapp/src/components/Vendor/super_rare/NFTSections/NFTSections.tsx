import React from 'react'

import { Section } from '../../../../modules/vendor/super_rare/routing/types'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { section, onSectionClick } = props

  return (
    <Menu className="NFTSections">
      <MenuItem
        value={Section.ALL}
        currentValue={section}
        onClick={onSectionClick}
      />
    </Menu>
  )
}

export default React.memo(NFTSections)
