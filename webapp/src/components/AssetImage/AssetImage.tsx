import React, { useCallback, useMemo, useState } from 'react'
import { LazyImage } from 'react-lazy-images'
import classNames from 'classnames'
import { BodyShape, NFTCategory, Rarity } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Center, Loader, Popup, WearablePreview } from 'decentraland-ui'

import { getAssetImage, getAssetName } from '../../modules/asset/utils'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import { Atlas } from '../Atlas'
import { Props } from './AssetImage.types'
import './AssetImage.css'

// 1x1 transparent pixel
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const DEFAULT_COLOR = 'bbbbbb'

type Color = { r: number; g: number; b: number }
type WrappedColor = { color: Color }

const valueToHex = (value: number) =>
  ('00' + Math.min(255, (value * 255) | 0).toString(16)).slice(-2)

const colorToHex = (color: Color): string => {
  if (isColor(color)) {
    return valueToHex(color.r) + valueToHex(color.g) + valueToHex(color.b)
  }
  const maybeWrapped = (color as unknown) as Partial<WrappedColor>
  if (isWrapped(maybeWrapped)) {
    return colorToHex(maybeWrapped.color!)
  }

  return DEFAULT_COLOR
}

// sometimes the color come from the catalyst wrapped in an extra "color": { } object
const isWrapped = (maybeWrapped: Partial<WrappedColor>) =>
  maybeWrapped.color && isColor(maybeWrapped.color)
const isColor = (maybeColor: Partial<Color>) =>
  typeof maybeColor.r === 'number' &&
  typeof maybeColor.g === 'number' &&
  typeof maybeColor.b === 'number'

const AssetImage = (props: Props) => {
  const {
    asset,
    isDraggable,
    withNavigation,
    hasPopup,
    zoom,
    isSmall,
    showMonospace,
    avatar
  } = props
  const { parcel, estate, wearable, ens } = asset.data

  const [isLoadingWearablePreview, setIsLoadingWearablePreview] = useState(
    isDraggable
  )
  const [wearablePreviewError, setWearablePreviewError] = useState(false)
  const [isTrying, setIsTrying] = useState(false)
  const handleLoad = useCallback(() => {
    setIsLoadingWearablePreview(false)
    setWearablePreviewError(false)
  }, [])
  const handleError = useCallback(error => {
    console.warn(error)
    setWearablePreviewError(true)
    setIsLoadingWearablePreview(false)
  }, [])
  const handleTryOut = useCallback(() => {
    if (!isTrying) {
      setIsTrying(true)
      setIsLoadingWearablePreview(true)
    }
  }, [isTrying])
  const handleShowWearable = useCallback(() => {
    if (isTrying) {
      setIsTrying(false)
      setIsLoadingWearablePreview(true)
    }
  }, [isTrying])

  const estateSelection = useMemo(() => (estate ? getSelection(estate) : []), [
    estate
  ])

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
          withPopup={hasPopup}
          withNavigation={withNavigation}
          selection={estateSelection}
          zoom={zoom}
          isEstate
        />
      )
    }

    case NFTCategory.WEARABLE: {
      let wearablePreview = null
      const isDev = process.env.REACT_APP_NETWORK !== 'mainnet'

      if (isDraggable) {
        let itemId: string | undefined
        let tokenId: string | undefined
        let skin
        let hair
        let bodyShape: 'male' | 'female' = 'male'
        if ('itemId' in asset && asset.itemId) {
          itemId = asset.itemId
        } else if ('tokenId' in asset && asset.tokenId) {
          tokenId = asset.tokenId
        }
        if (avatar) {
          skin = colorToHex(avatar.avatar.skin.color)
          hair = colorToHex(avatar.avatar.hair.color)
          bodyShape = avatar.avatar.bodyShape.toLowerCase().includes('female')
            ? 'female'
            : 'male'
        }

        const hasRepresentation = avatar
          ? wearable &&
            wearable.bodyShapes.some(shape =>
              avatar.avatar.bodyShape.includes(shape)
            )
          : true

        const missingBodyShape =
          hasRepresentation || !avatar
            ? null
            : avatar.avatar.bodyShape.includes(BodyShape.MALE)
            ? t('wearable_preview.missing_representation_error.male')
            : t('wearable_preview.missing_representation_error.female')

        wearablePreview = (
          <>
            <WearablePreview
              contractAddress={asset.contractAddress}
              itemId={itemId}
              tokenId={tokenId}
              profile={
                isTrying ? (avatar ? avatar.ethAddress : 'default') : undefined
              }
              skin={skin}
              hair={hair}
              bodyShape={bodyShape}
              emote="fashion-2"
              onLoad={handleLoad}
              onError={handleError}
              dev={isDev}
            />
            {isLoadingWearablePreview ? (
              <Center>
                <Loader
                  className="wearable-preview-loader"
                  active
                  size="large"
                />
              </Center>
            ) : null}
            <Popup
              content={
                <T
                  id="wearable_preview.missing_representation_error.message"
                  values={{ bodyShape: <b>{missingBodyShape}</b> }}
                />
              }
              trigger={
                <div className="preview-toggle-wrapper">
                  <Popup
                    position="top center"
                    content={<T id="wearable_preview.toggle_wearable" />}
                    trigger={
                      <Button
                        size="small"
                        className={classNames(
                          'preview-toggle',
                          'preview-toggle-wearable',
                          {
                            'is-active': !isTrying
                          }
                        )}
                        onClick={handleShowWearable}
                      />
                    }
                    disabled={!hasRepresentation}
                  />
                  <Popup
                    position="top center"
                    content={<T id="wearable_preview.toggle_avatar" />}
                    trigger={
                      <Button
                        size="small"
                        className={classNames(
                          'preview-toggle',
                          'preview-toggle-avatar',
                          {
                            'is-active': isTrying,
                            'is-disabled': !hasRepresentation
                          }
                        )}
                        onClick={hasRepresentation ? handleTryOut : undefined}
                      />
                    }
                    disabled={!hasRepresentation}
                  />
                </div>
              }
              position="top center"
              disabled={hasRepresentation}
            />
          </>
        )
      }
      const [light, dark] = Rarity.getGradient(wearable!.rarity)
      const backgroundImage = `radial-gradient(${light}, ${dark})`
      const classes =
        'rarity-background ' +
        (isLoadingWearablePreview ? 'is-loading-wearable-preview' : '')
      const showWearablePreview = !!wearablePreview && !wearablePreviewError
      return (
        <div
          className={classes}
          style={{
            backgroundImage
          }}
        >
          {showWearablePreview ? (
            wearablePreview
          ) : (
            <img
              alt={getAssetName(asset)}
              className="image"
              src={getAssetImage(asset)}
            />
          )}
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
          src={getAssetImage(asset)}
          alt={getAssetName(asset)}
          debounceDurationMs={1000}
          placeholder={({ ref }) => (
            <div ref={ref}>
              <Loader size="small" active />
            </div>
          )}
          actual={({ imageProps }) => (
            <img className="image" alt={getAssetName(asset)} {...imageProps} />
          )}
        />
      )
    }
  }
}

// the purpose of this wrapper is to make the div always be square, by using a 1x1 transparent pixel
const AssetImageWrapper = (props: Props) => {
  const { asset, className, ...rest } = props

  let classes = 'AssetImage'
  if (className) {
    classes += ' ' + className
  }

  return (
    <div className={classes}>
      <img src={PIXEL} alt="pixel" className="pixel" />
      <div className="image-wrapper">
        <AssetImage asset={asset} {...rest} />
      </div>
    </div>
  )
}

AssetImage.defaultProps = {
  isDraggable: false,
  withNavigation: false,
  zoom: 0.5,
  isSmall: false,
  showMonospace: false
}

export default React.memo(AssetImageWrapper)
