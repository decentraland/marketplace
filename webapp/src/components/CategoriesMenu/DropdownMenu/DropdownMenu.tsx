import React from 'react'

import { MenuItem } from '../MenuItem'
import { Props } from './DropdownMenu.types'

const DropdownMenu = (props: Props) => {
  const { sections, currentSection, onNavigate } = props

  return (
    <>
      <MenuItem
        section={sections[0]}
        currentSection={currentSection}
        onNavigate={onNavigate}
        isSub={true}
        withCaret={true}
      />
      <ul className="submenu">
        {sections.includes(currentSection)
          ? sections
              .slice(1)
              .map(menuSection => (
                <MenuItem
                  key={menuSection}
                  section={menuSection}
                  currentSection={currentSection}
                  onNavigate={onNavigate}
                  isSub={true}
                />
              ))
          : null}
      </ul>
    </>
  )
}

export default React.memo(DropdownMenu)
