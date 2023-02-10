import React from 'react'
import { Column } from '../../Layout/Column'
import { Row } from '../../Layout/Row'
import { Props } from './Highlight.types'
import './Highlight.css'

const Highlight = (props: Props) => {
  const { icon, name, description, onClick } = props
  const classes = ['Highlight']
  if (onClick) {
    classes.push('clickable')
  }
  return (
    <Column className={classes.join(' ')} onClick={onClick}>
      <Row>
        <Column align="left">{icon}</Column>
        <Column align="right">
          <div className="name">{name}</div>
          {description ? <div className="description">{description}</div> : null}
        </Column>
      </Row>
    </Column>
  )
}

export default React.memo(Highlight)
