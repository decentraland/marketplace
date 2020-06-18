import React from 'react'

import { Layout } from '../Layout'
import { Props } from './Title.types'
import './Title.css'

const Title = (props: Props) => (
  <Layout className="Title" left={props.left} right={props.right} />
)

export default React.memo(Title)
