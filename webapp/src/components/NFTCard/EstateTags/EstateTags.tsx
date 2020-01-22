import React from 'react'

import { Props } from './EstateTags.types'
import './EstateTags.css'

const EstateTags = (props: Props) => {
  const { nft } = props
  return (
    <div className="EstateTags tags">
      <div className="size">{nft.estate!.size.toLocaleString()} LAND</div>
    </div>
  )
}

export default EstateTags
