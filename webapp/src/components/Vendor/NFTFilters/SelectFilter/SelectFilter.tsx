import React from 'react'
import { Header, Dropdown } from 'decentraland-ui'

import { Props } from './SelectFilter.types'
import './SelectFilter.css'

const SelectFilter = (props: Props) => {
  const { name, options, value, onChange } = props
  return (
    <div className="SelectFilter Filter">
      <Header sub className="name">
        {name}
      </Header>
      <Dropdown
        value={value}
        options={options}
        onChange={(_event, props) => onChange(props.value as string)}
      />
    </div>
  )
}

export default SelectFilter
