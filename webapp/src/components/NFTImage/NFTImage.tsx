import React, { useMemo } from 'react'
import { Loader } from 'decentraland-ui'
import { LazyImage } from 'react-lazy-images'

import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import {
  RARITY_COLOR,
  RARITY_COLOR_LIGHT
} from '../../modules/nft/wearable/types'
import { NFT, NFTCategory } from '../../modules/nft/types'
import { Vendors } from '../../modules/vendor/types'
import { getNFTName } from '../../modules/nft/utils'
import { Atlas } from '../Atlas'
import { Props } from './NFTImage.types'
import './NFTImage.css'

// 1x1 transparent pixel
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const NFTImage = (props: Props) => {
  const {
    nft,
    isDraggable,
    withNavigation,
    zoom,
    isSmall,
    showMonospace
  } = props
  const { parcel, estate, wearable, ens } = (nft as NFT<
    Vendors.DECENTRALAND
  >).data

  const estateSelection = useMemo(() => (estate ? getSelection(estate) : []), [
    estate
  ])

  switch (nft.category) {
    case NFTCategory.PARCEL: {
      const x = +parcel!.x
      const y = +parcel!.y
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
      const [x, y] = getCenter(estateSelection)
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
        RARITY_COLOR_LIGHT[wearable!.rarity]
      }, ${RARITY_COLOR[wearable!.rarity]})`
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
      let name = ens!.subdomain
      let classes = ['ens-subdomain']
      if (isSmall) {
        name = name.slice(0, 2)
        classes.push('small')
      }
      return (
        <div className={classes.join(' ')}>
          <div className="name">{name}</div>
          {showMonospace ? <div className="monospace">{name}</div> : null}
        </div>
      )
    }

    default: {
      return (
        <LazyImage
          src={nft.image}
          alt={getNFTName(nft)}
          debounceDurationMs={1000}
          placeholder={({ ref }) => (
            <div ref={ref}>
              <Loader size="small" active />
            </div>
          )}
          actual={({ imageProps }) => (
            <img className="image" alt={getNFTName(nft)} {...imageProps} />
          )}
        />
      )
    }
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
  zoom: 0.5,
  isSmall: false,
  showMonospace: false
}

export default React.memo(NFTImageWrapper)
