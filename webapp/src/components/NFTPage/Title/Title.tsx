import React from 'react'

import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Props } from './Title.types'
import './Title.css'

const Title = (props: Props) => (
  <Row className="Title">
    <Column align="left" grow={true}>
      {props.left}
    </Column>
    <Column align="right">{props.right}</Column>
  </Row>
)

export default React.memo(Title)
