import React from 'react'

import { Props } from './Menu.types'
import './Menu.css'

const Menu = (props: Props) => {
  const { children } = props

  return <ul className="Menu">{children}</ul>
}

export default React.memo(Menu)
