import React from 'react'

import { Props } from './ParcelTags.types'
import './ParcelTags.css'

const ParcelTags = (props: Props) => {
  const { nft } = props
  return (
    <div className="ParcelTags tags">
      <div className="coords">
        <div className="pin" />
        {nft.parcel!.x},{nft.parcel!.y}
      </div>
    </div>
  )
}

export default ParcelTags
