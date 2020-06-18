import React from 'react'
import { Column } from 'decentraland-ui'

import { Props } from './Highlight.types'
import './Highlight.css'

const Highlight = (props: Props) => {
  const { icon, name, description, onClick } = props
  const classes = ['Highlight']
  if (onClick) {
    classes.push('clickable')
  }
  return (
    <Column className={classes.join(' ')} grow={false} onClick={onClick}>
      <div className="content">
        <div className="left">{icon}</div>
        <div className="right">
          <div className="name">{name}</div>
          {description ? (
            <div className="description">{description}</div>
          ) : null}
        </div>
      </div>
    </Column>
  )
}

export default React.memo(Highlight)
