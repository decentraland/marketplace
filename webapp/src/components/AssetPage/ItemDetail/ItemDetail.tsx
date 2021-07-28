import React from 'react'

import { Props } from './ItemDetail.types'

const ItemDetail = (props: Props) => {
  const { item } = props
  return <h1>{item.name}</h1>
}

export default React.memo(ItemDetail)
