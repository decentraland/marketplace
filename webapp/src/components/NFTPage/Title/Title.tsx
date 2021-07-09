import React from 'react'
import classnames from 'classnames'

import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Props } from './Title.types'
import './Title.css'

const Title = (props: Props) => {
  const { left, right, className, leftClassName, rightClassName } = props

  return (
    <Row className={classnames(['Title', className])}>
      <Column className={leftClassName} align="left" grow={true}>
        {left}
      </Column>
      <Column className={rightClassName} align="right">
        {right}
      </Column>
    </Row>
  )
}

export default React.memo(Title)
