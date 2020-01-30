import React from 'react'

import { getDistanceText } from '../../../modules/proximity/utils'
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
        <div className="tag plaza" title={getDistanceText(tags.plaza)} />
      ) : null}
      {tags?.road !== undefined ? (
        <div className="tag road" title={getDistanceText(tags.road)} />
      ) : null}
      {tags?.district !== undefined ? (
        <div className="tag district" title={getDistanceText(tags.district)} />
      ) : null}
    </div>
  )
}

export default ParcelTags
