import React from 'react'
import { Atlas } from '../Atlas'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import { Props } from './NFTImage.types'
import './NFTImage.css'
import { RARITY_COLOR } from '../../modules/nft/wearable/types'
import { getNFTName } from '../../modules/nft/utils'

// 1x1 transparent pixel
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const NFTImage = (props: Props) => {
  const { nft, zoom } = props

  if (nft.parcel) {
    const x = +nft.parcel.x
    const y = +nft.parcel.y
    const selection = [{ x, y }]
    return (
      <Atlas
        x={x}
        y={y}
        isDraggable={false}
        selection={selection}
        zoom={zoom}
        disableClick
      />
    )
  }

  if (nft.estate) {
    const selection = getSelection(nft)
    const [x, y] = getCenter(selection)
    return (
      <Atlas
        x={x}
        y={y}
        isDraggable={false}
        selection={selection}
        zoom={zoom}
        disableClick
      />
    )
  }

  if (nft.wearable) {
    return (
      <div
        className="rarity-background"
        style={{ backgroundColor: RARITY_COLOR[nft.wearable.rarity] }}
      >
        <img alt={getNFTName(nft)} className="image" src={nft.image} />
      </div>
    )
  }

  return <img alt={getNFTName(nft)} className="image" src={nft.image} />
}

// the purpose of this wrapper is to make the div always be square, by using a 1x1 transparent pixel
const NFTImageWrapper = (props: Props) => {
  const { nft, className, zoom } = props
  let classes = 'NFTImage'
  if (className) {
    classes += ' ' + className
  }
  return (
    <div className={classes}>
      <img src={PIXEL} alt="pixel" className="pixel" />
      <div className="image-wrapper">
        <NFTImage nft={nft} zoom={zoom} />
      </div>
    </div>
  )
}
;(NFTImage as React.FC).defaultProps = {
  zoom: 0.5
}

export default React.memo(NFTImageWrapper)
