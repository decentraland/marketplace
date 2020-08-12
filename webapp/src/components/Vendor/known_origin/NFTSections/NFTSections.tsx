import React from 'react'

import { Section } from '../../../../modules/vendor/known_origin/routing/types'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { section, address, onSectionClick } = props

  const isAccountPage = address !== undefined
  console.log('address', address, isAccountPage)

  return (
    <Menu className="NFTSections">
      <MenuItem
        value={Section.EDITIONS}
        currentValue={section}
        onClick={onSectionClick}
      />
      <MenuItem
        value={Section.TOKENS}
        currentValue={section}
        onClick={onSectionClick}
      />
    </Menu>
  )
}

export default React.memo(NFTSections)
