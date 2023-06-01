import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import classNames from 'classnames'
import { Env } from '@dcl/ui-env'
import {
  BodyShape,
  NFTCategory,
  Network,
  PreviewEmote,
  PreviewType,
  Rarity
} from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import {
  Badge,
  Button,
  Center,
  Icon,
  Loader,
  Popup,
  WearablePreview
} from 'decentraland-ui'
import { getAssetImage, getAssetName, isNFT } from '../../modules/asset/utils'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import * as events from '../../utils/events'
import { Atlas } from '../Atlas'
import ListedBadge from '../ListedBadge'
import { config } from '../../config'
import { Coordinate } from '../Coordinate'
import { JumpIn } from '../AssetPage/JumpIn'
import { getEthereumItemUrn } from './utils'
import { ControlOptionAction, Props } from './AssetImage.types'
import AvailableForMintPopup from './AvailableForMintPopup'
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
    avatar,
    wearableController,
    isTryingOn,
    isPlayingEmote,
    onSetIsTryingOn,
    onSetWearablePreviewController,
    children,
    hasBadges,
    item,
    wallet
  } = props
  const { parcel, estate, wearable, emote, ens } = asset.data

  const [isLoadingWearablePreview, setIsLoadingWearablePreview] = useState(
    isDraggable
  )
  const [wearablePreviewError, setWearablePreviewError] = useState(false)
  const handleLoad = useCallback(() => {
    setIsLoadingWearablePreview(false)
    setWearablePreviewError(false)
    if (asset.category === NFTCategory.EMOTE && !wearableController) {
      onSetWearablePreviewController(
        WearablePreview.createController('wearable-preview')
      )
    }
  }, [asset.category, wearableController, onSetWearablePreviewController])
  const handleError = useCallback(error => {
    console.warn(error)
    setWearablePreviewError(true)
    setIsLoadingWearablePreview(false)
  }, [])
  const handleTryOut = useCallback(() => {
    if (!isTryingOn) {
      onSetIsTryingOn(true)
      setIsLoadingWearablePreview(true)
    }
  }, [isTryingOn, onSetIsTryingOn])
  const handleShowWearable = useCallback(() => {
    if (isTryingOn) {
      onSetIsTryingOn(false)
      setIsLoadingWearablePreview(true)
    }
  }, [isTryingOn, onSetIsTryingOn])
  const handleControlActionChange = useCallback(
    async (action: ControlOptionAction) => {
      const ZOOM_DELTA = 0.03

      if (wearableController) {
        switch (action) {
          case ControlOptionAction.ZOOM_IN: {
            await wearableController.scene.changeZoom(ZOOM_DELTA)
            break
          }
          case ControlOptionAction.ZOOM_OUT: {
            await wearableController.scene.changeZoom(-ZOOM_DELTA)
            break
          }
          case ControlOptionAction.PLAY_EMOTE: {
            await wearableController.emote.play()
            break
          }
          case ControlOptionAction.STOP_EMOTE: {
            await wearableController.emote.stop()
            break
          }
          default:
            break
        }
      }
    },
    [wearableController]
  )

  const estateSelection = useMemo(() => (estate ? getSelection(estate) : []), [
    estate
  ])

  const [isTracked, setIsTracked] = useState(false)

  const isAvailableForMint =
    isNFT(asset) &&
    (item?.category === NFTCategory.WEARABLE ||
      item?.category === NFTCategory.EMOTE) &&
    item.available > 0 &&
    item.isOnSale

  // pick a random emote
  const previewEmote = useMemo(() => {
    const poses = [
      PreviewEmote.FASHION,
      PreviewEmote.FASHION_2,
      PreviewEmote.FASHION_3
    ]
    return isTryingOn ? poses[(Math.random() * poses.length) | 0] : undefined
  }, [isTryingOn])

  // This effect is here just to track on which mode the preview is initialized, that's why it has an empty dependency array, so this is triggered once on mount
  useEffect(() => {
    const isPreview = asset.category === NFTCategory.WEARABLE && isDraggable
    if (!isTracked && isPreview) {
      getAnalytics().track(events.INIT_PREVIEW, {
        mode: isTryingOn ? 'avatar' : 'wearable'
      })
      setIsTracked(true)
    }
    return () => {
      if (asset.category === NFTCategory.EMOTE && wearableController) {
        onSetWearablePreviewController(null)
      }
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
        >
          {hasBadges && children}
        </Atlas>
      )
    }

    case NFTCategory.WEARABLE: {
      let wearablePreview = null

      if (isDraggable) {
        let itemId: string | undefined
        let tokenId: string | undefined
        let skin
        let hair
        if ('itemId' in asset && asset.itemId) {
          itemId = asset.itemId
        } else if ('tokenId' in asset && asset.tokenId) {
          tokenId = asset.tokenId
        }
        if (avatar) {
          skin = colorToHex(avatar.avatar.skin.color)
          hair = colorToHex(avatar.avatar.hair.color)
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

        const isTryingOnEnabled = isTryingOn && hasRepresentation

        const ethereumUrn =
          !isNFT(asset) && asset.network === Network.ETHEREUM
            ? getEthereumItemUrn(asset)
            : ''

        const wearablePreviewProps =
          !isNFT(asset) && asset.network === Network.ETHEREUM
            ? {
                urns: [ethereumUrn],
                background: Rarity.getColor(asset.rarity),
                type: isTryingOn ? PreviewType.AVATAR : PreviewType.WEARABLE
              }
            : {
                contractAddress: asset.contractAddress,
                itemId,
                tokenId
              }

        const isOwnerOfNFT = isNFT(asset) && wallet?.address === asset.owner

        wearablePreview = (
          <>
            <WearablePreview
              profile={
                isTryingOnEnabled
                  ? avatar
                    ? avatar.ethAddress
                    : 'default'
                  : undefined
              }
              skin={skin}
              hair={hair}
              emote={isTryingOnEnabled ? previewEmote : undefined}
              onLoad={handleLoad}
              onError={handleError}
              {...wearablePreviewProps}
              dev={config.is(Env.DEVELOPMENT)}
            />
            {isAvailableForMint && !isOwnerOfNFT ? (
              <AvailableForMintPopup
                price={item.price}
                stock={item.available}
                rarity={item.rarity}
                contractAddress={item.contractAddress}
                itemId={item.itemId}
                network={item.network}
              />
            ) : null}
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
                            'is-active': !isTryingOnEnabled
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
                            'is-active': isTryingOnEnabled,
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
          {hasBadges && children}
        </div>
      )
    }

    case NFTCategory.EMOTE: {
      let wearablePreview = null
      let itemId: string | undefined
      let tokenId: string | undefined
      if ('itemId' in asset && asset.itemId) {
        itemId = asset.itemId
      } else if ('tokenId' in asset && asset.tokenId) {
        tokenId = asset.tokenId
      }
      const zoomControls = (
        <div className="asset-zoom-controls">
          <Button
            animated={false}
            className="zoom-control zoom-in-control"
            onClick={() =>
              handleControlActionChange(ControlOptionAction.ZOOM_IN)
            }
          >
            <Icon name="plus" />
          </Button>
          <Button
            animated={false}
            className="zoom-control zoom-out-control"
            onClick={() =>
              handleControlActionChange(ControlOptionAction.ZOOM_OUT)
            }
          >
            <Icon name="minus" />
          </Button>
        </div>
      )
      const playButton = (
        <div className="play-emote-control">
          <Button
            size="small"
            onClick={() =>
              handleControlActionChange(
                isPlayingEmote
                  ? ControlOptionAction.STOP_EMOTE
                  : ControlOptionAction.PLAY_EMOTE
              )
            }
          >
            {isPlayingEmote ? <Icon name="stop" /> : <Icon name="play" />}
            <span>
              {isPlayingEmote
                ? t('wearable_preview.stop_emote')
                : t('wearable_preview.play_emote')}
            </span>
          </Button>
        </div>
      )

      const isOwnerOfNFT = isNFT(asset) && wallet?.address === asset.owner

      if (isDraggable) {
        wearablePreview = (
          <>
            <WearablePreview
              id="wearable-preview"
              contractAddress={asset.contractAddress}
              itemId={itemId}
              tokenId={tokenId}
              profile={avatar ? avatar.ethAddress : 'default'}
              wheelZoom={1.5}
              wheelStart={100}
              onLoad={handleLoad}
              onError={handleError}
              dev={config.is(Env.DEVELOPMENT)}
            />
            {isAvailableForMint && !isOwnerOfNFT ? (
              <AvailableForMintPopup
                price={item.price}
                stock={item.available}
                rarity={item.rarity}
                contractAddress={item.contractAddress}
                itemId={item.itemId}
                network={item.network}
              />
            ) : null}
            {isLoadingWearablePreview ? (
              <Center>
                <Loader
                  className="wearable-preview-loader"
                  active
                  size="large"
                />
              </Center>
            ) : (
              <>
                {zoomControls}
                {playButton}
              </>
            )}
          </>
        )
      }
      const [light, dark] = Rarity.getGradient(emote!.rarity)
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
          {hasBadges && children}
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
  const {
    asset,
    className,
    showOrderListedTag,
    item,
    onFetchItem,
    ...rest
  } = props

  useEffect(() => {
    if (!item && isNFT(asset) && asset.itemId) {
      onFetchItem(asset.contractAddress, asset.itemId)
    }
  }, [asset, item, onFetchItem])

  const isAvailableForMint = useMemo(
    () =>
      isNFT(asset) &&
      (item?.category === NFTCategory.WEARABLE ||
        item?.category === NFTCategory.EMOTE) &&
      item.available > 0 &&
      item.isOnSale,
    [asset, item]
  )

  let classes = `AssetImage ${isAvailableForMint ? 'hasMintAvailable' : ''}`
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
        {showOrderListedTag ? <ListedBadge className="listed-badge" /> : null}
        <AssetImage
          asset={asset}
          item={item}
          onFetchItem={onFetchItem}
          {...rest}
        >
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
                  <Coordinate
                    className="coordinates"
                    x={coordinates.x}
                    y={coordinates.y}
                  />
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
  isSmall: false,
  showMonospace: false
}

export default React.memo(AssetImageWrapper)
