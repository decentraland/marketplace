import React, { useMemo } from 'react'
import { Atlas } from '../Atlas'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import {
  RARITY_COLOR,
  RARITY_COLOR_LIGHT
} from '../../modules/nft/wearable/types'
import { getNFTName } from '../../modules/nft/utils'
import { NFTCategory } from '../../modules/nft/types'
import { Props } from './NFTImage.types'
import './NFTImage.css'

// 1x1 transparent pixel
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const NFTImage = (props: Props) => {
  const { nft, isDraggable, withNavigation, zoom } = props

  const estateSelection = useMemo(() => (nft.estate ? getSelection(nft) : []), [
    nft
  ])

  switch (nft.category) {
    case NFTCategory.PARCEL: {
      const x = +nft.parcel!.x
      const y = +nft.parcel!.y
      const selection = [{ x, y }]
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withNavigation={withNavigation}
          selection={selection}
          zoom={zoom}
        />
      )
    }

    case NFTCategory.ESTATE: {
      const [x, y] = getCenter(estateSelection!)
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withNavigation={withNavigation}
          selection={estateSelection}
          zoom={zoom}
          isEstate
        />
      )
    }

    case NFTCategory.WEARABLE: {
      const backgroundImage = `radial-gradient(${
        RARITY_COLOR_LIGHT[nft.wearable!.rarity]
      }, ${RARITY_COLOR[nft.wearable!.rarity]})`
      return (
        <div
          className="rarity-background"
          style={{
            backgroundImage
          }}
        >
          <img alt={getNFTName(nft)} className="image" src={nft.image} />
        </div>
      )
    }

    case NFTCategory.ENS: {
      return (
        <div className="ens-subdomain">
          <span>{nft.ens!.subdomain}</span>
        </div>
      )
    }

    default:
      return <img alt={getNFTName(nft)} className="image" src={nft.image} />
  }
}

// the purpose of this wrapper is to make the div always be square, by using a 1x1 transparent pixel
const NFTImageWrapper = (props: Props) => {
  const { nft, className, ...rest } = props
  let classes = 'NFTImage'
  if (className) {
    classes += ' ' + className
  }
  return (
    <div className={classes}>
      <img src={PIXEL} alt="pixel" className="pixel" />
      <div className="image-wrapper">
        <NFTImage nft={nft} {...rest} />
      </div>
    </div>
  )
}

NFTImage.defaultProps = {
  isDraggable: false,
  withNavigation: false,
  zoom: 0.5
}

export default React.memo(NFTImageWrapper)
