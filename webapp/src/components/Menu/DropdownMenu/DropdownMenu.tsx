import React from 'react'

import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './DropdownMenu.types'

const DropdownMenu = <T extends unknown>(props: Props<T>) => {
  const { values, currentValue, onMenuItemClick } = props

  return (
    <>
      <MenuItem
        value={values[0]}
        currentValue={currentValue}
        onClick={onMenuItemClick}
        isSub={true}
        withCaret={true}
      />
      <ul className="submenu">
        {values.includes(currentValue!)
          ? values
              .slice(1)
              .map((value, index) => (
                <MenuItem<T>
                  key={index}
                  value={value}
                  currentValue={currentValue}
                  onClick={onMenuItemClick}
                  isSub={true}
                />
              ))
          : null}
      </ul>
    </>
  )
}

export default React.memo(DropdownMenu) as typeof DropdownMenu
