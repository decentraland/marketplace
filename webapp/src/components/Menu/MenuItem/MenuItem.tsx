import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Props } from './MenuItem.types'

const MenuItem = <T extends unknown>(props: Props<T>) => {
  const { value, currentValue, isSub, withCaret, onClick } = props

  const classNames: string[] = ['MenuItem']

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
      {t(`menu.${value}`)}
      {withCaret ? <i className="dropdown icon" /> : null}
    </li>
  )
}

export default React.memo(MenuItem) as typeof MenuItem
