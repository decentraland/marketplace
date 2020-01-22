import React from 'react'

import { Props } from './Title.types'
import './Title.css'

const Title = (props: Props) => (
  <div className="Title">
    <div className="left">{props.left}</div>
    <div className="right">{props.right}</div>
  </div>
)

export default React.memo(Title)
