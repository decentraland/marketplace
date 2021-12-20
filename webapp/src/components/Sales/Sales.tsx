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
    </div>
  )
}

export default React.memo(Sales)
