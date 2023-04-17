import React from 'react'
import { formatWeiMANA } from '../../../lib/mana'
import { Mana } from '../../Mana'
import { Props } from './Price.types'

const Price = (props: Props) => {
  const { network, price } = props
  return (
    <Mana showTooltip network={network} inline withTooltip>
      {formatWeiMANA(price)}
    </Mana>
  )
}

export default React.memo(Price)
