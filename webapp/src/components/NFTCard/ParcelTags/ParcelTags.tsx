import React from 'react'

import { getDistance } from '../../../modules/proximity/utils'
import { Props } from './ParcelTags.types'
import './ParcelTags.css'

const ParcelTags = (props: Props) => {
  const { nft, proximity } = props
  const id = nft.parcel!.x + ',' + nft.parcel!.y
  const tags = proximity[id]

  return (
    <div className="ParcelTags tags">
      <div className="coords">
        <div className="pin" />
        {nft.parcel!.x},{nft.parcel!.y}
      </div>
      {tags?.plaza !== undefined ? (
        <div className="tag plaza" title={getDistance(tags.plaza)} />
      ) : null}
      {tags?.road !== undefined ? (
        <div className="tag road" title={getDistance(tags.road)} />
      ) : null}
      {tags?.district !== undefined ? (
        <div className="tag district" title={getDistance(tags.district)} />
      ) : null}
    </div>
  )
}

export default ParcelTags
