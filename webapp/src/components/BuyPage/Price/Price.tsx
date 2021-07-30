import React from 'react'
import { formatMANA } from '../../../lib/mana'
import { Mana } from '../../Mana'
import { Props } from './Price.types'

const Price = (props: Props) => {
  const { network, price } = props
  return (
    <Mana network={network} inline withTooltip>
      {formatMANA(price)}
    </Mana>
  )
}

export default React.memo(Price)
