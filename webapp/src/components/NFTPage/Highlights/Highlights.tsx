import React from 'react'
import { Header } from 'decentraland-ui'
import './Highlights.css'

const Highlights = (props: { children: React.ReactNode }) => {
  return (
    <div className="Highlights">
      <Header sub>Highlights</Header>
      <div className="row">{props.children}</div>
    </div>
  )
}

export default React.memo(Highlights)
