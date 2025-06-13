import React, { useEffect, useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import classNames from 'classnames'
import { NFTCategory } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Badge, Loader } from 'decentraland-ui'
import { isLegacyOrder } from '../../lib/orders'
import { getAssetImage, getAssetName, isNFT } from '../../modules/asset/utils'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import * as events from '../../utils/events'
import { JumpIn } from '../AssetPage/JumpIn'
import { Atlas } from '../Atlas'
import { Coordinate } from '../Coordinate'
import ListedBadge from '../ListedBadge'
import WarningBadge from '../WarningBadge'
import { EnsImage } from './EnsImage'
import { Preview } from './Preview'
import { Props } from './AssetImage.types'
import './AssetImage.css'

// 1x1 transparent pixel
const PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const AssetImage = (props: Props) => {
  const {
    asset,
    avatar,
    children,
    item,
    showUpdatedDateWarning,
    videoHash,
    wallet,
    withNavigation,
    zoom,
    isDraggable,
    isLoadingVideoHash,
    isSmall,
    isTryingOn,
    isUnityWearablePreviewEnabled,
    hasBadges,
    hasFetchedVideoHash,
    hasPopup,
    onFetchSmartWearableVideoHash,
    onSetIsTryingOn,
    onPlaySmartWearableVideoShowcase
  } = props
  const { parcel, estate, ens } = asset.data

  const estateSelection = useMemo(() => (estate ? getSelection(estate) : []), [estate])

  const [isTracked, setIsTracked] = useState(false)

  // This effect is here just to track on which mode the preview is initialized, that's why it has an empty dependency array, so this is triggered once on mount
  useEffect(() => {
    const isPreview = asset.category === NFTCategory.WEARABLE && isDraggable

    if (!isTracked && isPreview) {
      getAnalytics()?.track(events.INIT_PREVIEW, {
        mode: isTryingOn ? 'avatar' : 'wearable'
      })
      setIsTracked(true)
    }

    if (isPreview && asset.data.wearable?.isSmart && asset.urn && videoHash === undefined && !isLoadingVideoHash && !hasFetchedVideoHash) {
      onFetchSmartWearableVideoHash(asset)
    }
  }, []) // eslint-disable-line

  switch (asset.category) {
    case NFTCategory.PARCEL: {
      const x = +parcel!.x
      const y = +parcel!.y
      const selection = [{ x, y }]
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withPopup={hasPopup}
          withNavigation={withNavigation}
          selection={selection}
          zoom={zoom}
          showForRent={false}
          showOnSale={false}
          showOwned={false}
          lastUpdated={showUpdatedDateWarning ? new Date(asset.updatedAt) : undefined}
        >
          {hasBadges && children}
        </Atlas>
      )
    }

    case NFTCategory.ESTATE: {
      const [x, y] = getCenter(estateSelection)
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withPopup={hasPopup}
          withNavigation={withNavigation}
          selection={estateSelection}
          zoom={zoom}
          showForRent={false}
          showOnSale={false}
          showOwned={false}
          isEstate
          lastUpdated={showUpdatedDateWarning ? new Date(asset.updatedAt) : undefined}
        >
          {hasBadges && children}
        </Atlas>
      )
    }

    case NFTCategory.WEARABLE:
    case NFTCategory.EMOTE: {
      return (
        <Preview
          asset={asset}
          avatar={avatar}
          item={item}
          videoHash={videoHash}
          wallet={wallet}
          isDraggable={isDraggable}
          isLoadingVideoHash={isLoadingVideoHash}
          isTryingOn={isTryingOn}
          isUnityWearablePreviewEnabled={!isUnityWearablePreviewEnabled}
          onSetIsTryingOn={onSetIsTryingOn}
          onPlaySmartWearableVideoShowcase={onPlaySmartWearableVideoShowcase}
        />
      )
    }

    case NFTCategory.ENS: {
      const name = ens!.subdomain
      return (
        <div className={classNames(isSmall && 'small', 'ens')}>
          <EnsImage onlyLogo={isSmall} name={name} />
          {hasBadges && children}
        </div>
      )
    }

    default: {
      return (
        <LazyLoadImage
          src={getAssetImage(asset)}
          alt={getAssetName(asset)}
          delayMethod="debounce"
          className="image"
          delayTime={1000}
          placeholder={
            <div>
              <Loader size="small" active />
            </div>
          }
        >
          {hasBadges && children}
        </LazyLoadImage>
      )
    }
  }
}

// the purpose of this wrapper is to make the div always be square, by using a 1x1 transparent pixel
const AssetImageWrapper = (props: Props) => {
  const { asset, className, showOrderListedTag, item, onFetchItem, order, wallet, ...rest } = props

  useEffect(() => {
    if (!item && isNFT(asset) && asset.itemId && (asset.category === NFTCategory.WEARABLE || asset.category === NFTCategory.EMOTE)) {
      onFetchItem(asset.contractAddress, asset.itemId)
    }
  }, [asset, item, onFetchItem])

  const isAvailableForMint = useMemo(
    () =>
      isNFT(asset) &&
      (item?.category === NFTCategory.WEARABLE || item?.category === NFTCategory.EMOTE) &&
      item.available > 0 &&
      item.isOnSale,
    [asset, item]
  )
  const isOwnerOfNFT = isNFT(asset) && wallet?.address === asset.owner

  let classes = `AssetImage ${isAvailableForMint && !isOwnerOfNFT ? 'hasMintAvailable' : ''}`
  if (className) {
    classes += ' ' + className
  }

  const coordinates: { x: number; y: number } | null = useMemo(() => {
    switch (asset.category) {
      case NFTCategory.ESTATE: {
        if (asset.data.estate!.size) {
          return {
            x: asset.data.estate!.parcels[0].x,
            y: asset.data.estate!.parcels[0].y
          }
        }
        return null
      }
      case NFTCategory.PARCEL: {
        return {
          x: Number(asset.data.parcel!.x),
          y: Number(asset.data.parcel!.y)
        }
      }
      default:
        return null
    }
  }, [asset])

  return (
    <div className={classes}>
      <img src={PIXEL} alt="pixel" className="pixel" />
      <div className="image-wrapper">
        {showOrderListedTag || !!order ? (
          <>
            {showOrderListedTag ? <ListedBadge className="listed-badge" /> : null}
            {!!order && wallet?.address === order.owner && isLegacyOrder(order) ? <WarningBadge /> : null}
          </>
        ) : null}
        <AssetImage asset={asset} item={item} wallet={wallet} onFetchItem={onFetchItem} {...rest}>
          <div className="badges">
            {coordinates ? (
              <>
                {asset.category === NFTCategory.ESTATE ? (
                  <>
                    <Badge className="coordinates" color="#37333d">
                      {asset.data.estate!.size.toLocaleString()} LAND
                    </Badge>
                  </>
                ) : (
                  <Coordinate className="coordinates" x={coordinates.x} y={coordinates.y} />
                )}
                <JumpIn compact x={coordinates.x} y={coordinates.y} />
              </>
            ) : null}
          </div>
        </AssetImage>
      </div>
    </div>
  )
}

AssetImage.defaultProps = {
  isDraggable: false,
  withNavigation: false,
  zoom: 0.5,
  isSmall: false
}

export default React.memo(AssetImageWrapper)
