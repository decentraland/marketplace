import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Image } from 'decentraland-ui'
import classNames from 'classnames'

import { Props } from './MenuItem.types'
import './MenuItem.css'

const MenuItem = <T extends unknown>(props: Props<T>) => {
  const {
    className = '',
    value,
    currentValue,
    subtitle,
    image,
    nestedLevel,
    withCaret,
    onClick
  } = props

  const handleOnClick = useCallback(() => {
    onClick(value)
  }, [value, onClick])

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        handleOnClick()
      }
    },
    [handleOnClick]
  )

  const containerClass = classNames('MenuItem', className, {
    active: currentValue === value,
    [`sub sub-${nestedLevel}`]: nestedLevel
  })

  return (
    <li
      className={containerClass}
      onClick={handleOnClick}
      tabIndex={0}
      onKeyDown={handleOnKeyDown}
    >
      {image && <Image alt={image} src={image} width="25" circular />}

      <div className="content">
        {t(`menu.${value}`)}
        {subtitle ? <div className="subtitle">{subtitle}</div> : null}
      </div>
      {withCaret ? <i className="dropdown icon" /> : null}
    </li>
  )
}

export default React.memo(MenuItem) as typeof MenuItem
