import React from 'react'
import { Header } from 'decentraland-ui'
import Stats from './Stats'
import Activity from './Activity'
import './Sales.css'

const Sales = () => {
  return (
    <div className="Sales">
      <div className="header-with-filter">
        <Header>Stats</Header>
      </div>
      <Stats />
      <Activity />
    </div>
  )
}

export default React.memo(Sales)
