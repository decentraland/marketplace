import React from 'react'
import { Badge } from 'decentraland-ui'
import { Props } from './Coordinate.types'
import './Coordinate.css'

const Coordinate = (props: Props) => {
  const classes = ['Coordinate']
  const { x, y, className } = props

  if (className) {
    classes.push(className)
  }

  return (
    <Badge className={classes.join(' ')} color="#37333D">
      <i className="pin" />
      {`${x},${y}`}
    </Badge>
  )
}

export default React.memo(Coordinate)
