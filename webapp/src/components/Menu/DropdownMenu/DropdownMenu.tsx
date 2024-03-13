import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './DropdownMenu.types'

const DropdownMenu = <T extends string | number>(props: Props<T>) => {
  const { values, currentValue, onMenuItemClick } = props
  const [isDropdownOpen, setIsDropdownOpen] = useState(currentValue && values.includes(currentValue))

  const handleMenuItemClick = useCallback(
    (value: T) => {
      if (value === values[0]) {
        setIsDropdownOpen(!isDropdownOpen)
      }

      onMenuItemClick(value)
    },
    [values, isDropdownOpen, onMenuItemClick]
  )

  useEffect(() => {
    if (!currentValue || !values.includes(currentValue)) {
      setIsDropdownOpen(false)
    }
  }, [values, currentValue])

  return (
    <>
      <MenuItem
        value={values[0]}
        currentValue={currentValue}
        onClick={handleMenuItemClick}
        nestedLevel={1}
        withCaret={true}
        className={classNames({ open: isDropdownOpen })}
      />
      <ul className="submenu">
        {currentValue && values.includes(currentValue) && isDropdownOpen
          ? values
              .slice(1)
              .map((value, index) => (
                <MenuItem<T> key={index} value={value} currentValue={currentValue} onClick={handleMenuItemClick} nestedLevel={2} />
              ))
          : null}
      </ul>
    </>
  )
}

export default React.memo(DropdownMenu) as typeof DropdownMenu
