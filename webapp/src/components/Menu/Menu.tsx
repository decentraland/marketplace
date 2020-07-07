import React from 'react'

import { Props } from './Menu.types'
import './Menu.css'

const Menu = (props: Props) => {
  const { className = '', children } = props

  return <ul className={`Menu ${className}`}>{children}</ul>
}

export default React.memo(Menu)
