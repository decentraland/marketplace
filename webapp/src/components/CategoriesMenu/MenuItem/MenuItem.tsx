import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Section } from '../../../modules/routing/search'
import { Props } from './MenuItem.types'

const MenuItem = (props: Props) => {
  const { section, currentSection, isSub, withCaret, onNavigate } = props

  const handleSectionChange = useCallback(
    (section: Section) => {
      onNavigate({ page: 1, section })
    },
    [onNavigate]
  )

  const classNames: string[] = ['MenuItem']
  if (currentSection === section) {
    classNames.push('active')
  }
  if (isSub) {
    classNames.push('sub')
  }

  return (
    <li
      className={classNames.join(' ')}
      onClick={() => handleSectionChange(section)}
    >
      {t(`categories_menu.menu_item.${section}`)}
      {withCaret ? <i className="dropdown icon" /> : null}
    </li>
  )
}

export default React.memo(MenuItem)
