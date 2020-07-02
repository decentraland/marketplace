import React, { useCallback, useState } from 'react'

import { Section } from '../../../modules/routing/types'
import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './VendorMenuItem.types'
import './VendorMenuItem.css'

const VendorMenuItem = (props: Props) => {
  const { vendor, section, sections, onClick } = props

  const [isOpen, setIsOpen] = useState(true)

  const handleToggleOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  return (
    <>
      <MenuItem
        className="VendorMenuItem"
        value={vendor}
        currentValue={isOpen ? vendor : undefined}
        image={`/${vendor}.png`}
        onClick={handleToggleOpen}
        withCaret
      />
      {isOpen
        ? sections.map((menuSection: Section) => (
            <MenuItem
              currentValue={section}
              value={menuSection}
              onClick={onClick}
            />
          ))
        : null}
    </>
  )
}

export default React.memo(VendorMenuItem)
