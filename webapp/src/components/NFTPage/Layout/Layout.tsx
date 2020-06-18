import React from 'react'
import { Row, Column } from 'decentraland-ui'

import { Props } from './Layout.types'
import './Layout.css'

const Layout = (props: Props) => {
  const { className, left, right } = props

  return (
    <div className={`Layout ${className}`}>
      <Row>
        {left ? <Column align="left">{left}</Column> : null}
        {right ? <Column align="right">{right}</Column> : null}
      </Row>
    </div>
  )
}

Layout.defaultProps = {
  className: ''
}

export default React.memo(Layout)
