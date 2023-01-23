import React from 'react'
import { AssetImage } from '../../AssetImage'
import { Props } from './Map.types'

const Map = (props: Props) => {
  const { asset, className } = props

  return (
    <div className={className}>
      <AssetImage asset={asset} />
    </div>
  )
}

export default React.memo(Map)
