import React from 'react'

import { Section } from '../../../../modules/vendor/known_origin/routing/types'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  const { section, address, onSectionClick } = props

  const isAccountPage = address !== undefined
  const currentValue =
    section === Section.ALL && isAccountPage ? Section.EDITIONS : section

  return (
    <Menu className="NFTSections">
      {isAccountPage ? (
        <>
          <MenuItem
            value={Section.EDITIONS}
            currentValue={currentValue}
            onClick={onSectionClick}
          />
          <MenuItem
            value={Section.TOKENS}
            currentValue={currentValue}
            onClick={onSectionClick}
          />
        </>
      ) : (
        <MenuItem
          value={Section.ALL}
          currentValue={currentValue}
          onClick={onSectionClick}
        />
      )}
    </Menu>
  )
}

export default React.memo(NFTSections)
