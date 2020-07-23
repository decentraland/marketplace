import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Image } from 'decentraland-ui'

import { Props } from './MenuItem.types'
import './MenuItem.css'

const MenuItem = <T extends unknown>(props: Props<T>) => {
  const {
    className = '',
    value,
    currentValue,
    subtitle,
    image,
    isSub,
    withCaret,
    onClick
  } = props

  const classNames: string[] = ['MenuItem', className]

  if (currentValue === value) {
    classNames.push('active')
  }
  if (isSub) {
    classNames.push('sub')
  }

  const handleOnClick = useCallback(() => {
    onClick(value)
  }, [value, onClick])

  return (
    <li className={classNames.join(' ')} onClick={handleOnClick}>
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
