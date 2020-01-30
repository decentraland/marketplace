import React from 'react'
import { ProximityTags } from '../ProximityTags'
import { Props } from './ParcelTags.types'
import './ParcelTags.css'

const ParcelTags = (props: Props) => {
  const { nft } = props
  const { x, y } = nft.parcel!
  return (
    <div className="ParcelTags tags">
      <div className="coords">
        <div className="pin" />
        {x},{y}
      </div>
      <ProximityTags nft={nft} />
    </div>
  )
}

export default ParcelTags
