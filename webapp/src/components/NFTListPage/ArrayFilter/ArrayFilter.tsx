import React from 'react'
import { Header } from 'decentraland-ui'

import { Props } from './ArrayFilter.types'
import './ArrayFilter.css'

const isSelected = (value: string, values: string[]) => values.includes(value)

const getClasses = (value: string, values: string[]) => {
  const classes = ['option']
  if (isSelected(value, values)) {
    classes.push('selected')
  }
  return classes.join(' ')
}

const getNewValues = (value: string, values: string[]) => {
  return values.some(x => x === value)
    ? values.filter(x => x !== value)
    : [...values, value]
}

const ArrayFilter = (props: Props) => {
  const { name, values, options, onChange } = props
  return (
    <div className="ArrayFilter">
      <Header sub className="name">
        {name}
      </Header>
      <div className="options">
        {options.map(option => (
          <div
            className={getClasses(option, values)}
            onClick={() => onChange(getNewValues(option, values))}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArrayFilter
