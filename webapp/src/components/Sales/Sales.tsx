import React, { useRef, useState } from 'react'
import { Dropdown, Header } from 'decentraland-ui'
import './Sales.css'

const Sales = () => {
  const options = useRef([{ value: 'allTime', text: 'All Time' }])

  const [current, setCurrent] = useState(options.current[0].value)

  return (
    <div className="Sales">
      <div className="header-with-filter">
        <Header>Stats</Header>
        <Dropdown
          direction="left"
          value={current}
          options={options.current}
          onChange={(_, data) => setCurrent(data.value as any)}
        />
      </div>
      <div className="simple-stats">
        <SimpleStat subtitle="Total sales" value="4" />
        <SimpleStat subtitle="Ethereum earnings" value="11,235" />
        <SimpleStat subtitle="Polygon earnings" value="30,600" />
      </div>
      <div className="activity"></div>
    </div>
  )
}

const SimpleStat = ({
  value,
  subtitle
}: {
  value: string
  subtitle: string
}) => {
  return (
    <div className="simple-stat">
      <div className="simple-stat-icon"></div>
      <div className="simple-stat-details">
        <div className="simple-stat-value">{value}</div>
        <div className="simple-stat-subtitle">{subtitle}</div>
      </div>
    </div>
  )
}

export default React.memo(Sales)
