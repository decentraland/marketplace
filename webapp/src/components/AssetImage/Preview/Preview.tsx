import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Network, PreviewType, Rarity, BodyShape, NFTCategory, PreviewEmote, PreviewRenderer } from '@dcl/schemas'
import { Env } from '@dcl/ui-env'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { WearablePreview as DCLWearablePreview, Button, Center, Loader, Popup, Icon, EmoteControls, ZoomControls } from 'decentraland-ui'
import { config } from '../../../config'
import { getAssetImage, getAssetName, isNFT } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import AvailableForMintPopup from '../AvailableForMintPopup'
import { getEthereumItemUrn, colorToHex } from '../utils'
import { PreviewProps } from './Preview.types'
import './Preview.css'

export const Preview: React.FC<PreviewProps> = ({
  asset,
  avatar,
  children,
  item,
  videoHash,
  wallet,
  isDraggable,
  isLoadingVideoHash,
  isUnityWearablePreviewEnabled,
  hasBadges,
  hasFetchedVideoHash,
  onFetchSmartWearableVideoHash,
  onPlaySmartWearableVideoShowcase
}) => {
  const [isTryingOn, setIsTryingOn] = useState(false)
  const [isTracked, setIsTracked] = useState(false)
  const [isLoadingWearablePreview, setIsLoadingWearablePreview] = useState(isDraggable)
  const [wearablePreviewError, setWearablePreviewError] = useState(false)
  const [rendererType, setRendererType] = useState<PreviewRenderer | null>(null)

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
  }, [])

  const handleLoad = useCallback((renderer: PreviewRenderer | null) => {
    setIsLoadingWearablePreview(false)
    setWearablePreviewError(false)
    setRendererType(renderer)
    console.log('renderer', { renderer })
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('Preview error:', error)
    setWearablePreviewError(true)
    setIsLoadingWearablePreview(false)
  }, [])

  const handleTryOut = useCallback(() => {
    if (!isTryingOn) {
      setIsTryingOn(true)
      getAnalytics()?.track(events.TOGGLE_PREVIEW_MODE, {
        mode: 'avatar',
        itemId: asset.itemId,
        contractAddress: asset.contractAddress
      })
    }
  }, [isTryingOn, setIsTryingOn, asset.itemId, asset.contractAddress])

  const handleShowWearable = useCallback(() => {
    if (isTryingOn) {
      setIsTryingOn(false)
      getAnalytics()?.track(events.TOGGLE_PREVIEW_MODE, {
        mode: 'wearable',
        itemId: asset.itemId,
        contractAddress: asset.contractAddress
      })
    }
  }, [isTryingOn, setIsTryingOn, asset.itemId, asset.contractAddress])

  const previewEmote = useMemo(() => {
    const poses = [PreviewEmote.FASHION, PreviewEmote.FASHION_2, PreviewEmote.FASHION_3]
    return isTryingOn ? poses[(Math.random() * poses.length) | 0] : undefined
  }, [isTryingOn])

  const { itemId, tokenId } = useMemo(() => {
    let itemId: string | undefined
    let tokenId: string | undefined
    if ('itemId' in asset && asset.itemId) {
      itemId = asset.itemId
    } else if ('tokenId' in asset && asset.tokenId) {
      tokenId = asset.tokenId
    }
    return { itemId, tokenId }
  }, [asset])

  const { skin, hair } = useMemo(() => {
    let skin
    let hair
    if (avatar?.avatar?.skin?.color) {
      skin = colorToHex(avatar.avatar.skin.color)
    }
    if (avatar?.avatar?.hair?.color) {
      hair = colorToHex(avatar.avatar.hair.color)
    }
    return { skin, hair }
  }, [avatar])

  const hasRepresentation = useMemo(
    () => (avatar ? asset.data.wearable?.bodyShapes.some(shape => avatar.avatar.bodyShape.includes(shape)) : true),
    [avatar, asset.data.wearable?.bodyShapes]
  )

  const missingBodyShape = useMemo(
    () =>
      hasRepresentation || !avatar
        ? null
        : avatar.avatar.bodyShape.includes(BodyShape.MALE)
          ? t('wearable_preview.missing_representation_error.male')
          : t('wearable_preview.missing_representation_error.female'),
    [hasRepresentation, avatar]
  )

  const isTryingOnEnabled = useMemo(() => isTryingOn && hasRepresentation, [isTryingOn, hasRepresentation])

  const ethereumUrn = useMemo(
    () => (asset.network === Network.ETHEREUM ? (isNFT(asset) ? asset.urn || '' : getEthereumItemUrn(asset)) : ''),
    [asset]
  )

  const wearablePreviewProps = useMemo(
    () =>
      asset.network === Network.ETHEREUM
        ? {
            urns: [ethereumUrn],
            type: isTryingOn ? PreviewType.AVATAR : PreviewType.WEARABLE
          }
        : {
            contractAddress: asset.contractAddress,
            itemId,
            tokenId
          },
    [asset, ethereumUrn, isTryingOn, itemId, tokenId]
  )

  const isAvailableForMint = useMemo(
    () =>
      isNFT(asset) &&
      (item?.category === NFTCategory.WEARABLE || item?.category === NFTCategory.EMOTE) &&
      item.available > 0 &&
      item.isOnSale,
    [asset, item]
  )

  const isOwnerOfNFT = useMemo(() => isNFT(asset) && wallet?.address === asset.owner, [asset, wallet?.address])

  const isBabylonRenderer = useMemo(() => rendererType === PreviewRenderer.BABYLON, [rendererType])

  const renderControls = useCallback(() => {
    // Show controls for emotes when using Babylon renderer (not Unity)
    if (isBabylonRenderer && asset.category === NFTCategory.EMOTE) {
      return (
        <>
          <ZoomControls className="asset-zoom-controls" wearablePreviewId="wearable-preview" />
          <EmoteControls
            className="asset-emote-controls"
            wearablePreviewId="wearable-preview"
            hideFrameInput
            hideProgressInput
            renderPlayButton={({ isPlaying, onToggle }) => (
              <Button className="play-button" size="small" onClick={onToggle}>
                {isPlaying ? <Icon name="stop" /> : <Icon name="play" />}
                <span>{isPlaying ? t('wearable_preview.stop_emote') : t('wearable_preview.play_emote')}</span>
              </Button>
            )}
            renderSoundButton={({ isSoundEnabled, onToggle }) => (
              <Button
                className={classNames('sound-button', {
                  enabled: isSoundEnabled
                })}
                size="small"
                aria-label="enable sound"
                onClick={onToggle}
              />
            )}
          />
        </>
      )
    }

    // Show toggle controls for wearables when using Babylon renderer
    if (isBabylonRenderer && asset.category === NFTCategory.WEARABLE) {
      return (
        <Popup
          content={t('wearable_preview.missing_representation_error.message', { bodyShape: <b>{missingBodyShape}</b> })}
          trigger={
            <div className="preview-toggle-wrapper">
              <Popup
                position="top center"
                content={t('wearable_preview.toggle_wearable')}
                trigger={
                  <Button
                    size="small"
                    className={classNames('preview-toggle', 'preview-toggle-wearable', {
                      'is-active': !isTryingOnEnabled
                    })}
                    onClick={handleShowWearable}
                  />
                }
                disabled={!hasRepresentation}
              />
              <Popup
                position="top center"
                content={t('wearable_preview.toggle_avatar')}
                trigger={
                  <Button
                    size="small"
                    className={classNames('preview-toggle', 'preview-toggle-avatar', {
                      'is-active': isTryingOnEnabled,
                      'is-disabled': !hasRepresentation
                    })}
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
      )
    }

    // Show Smart Wearable Play showcase for both Babylon and Unity renderers
    if (asset.data.wearable?.isSmart && asset.urn && videoHash) {
      return (
        <div className="asset-wearable-controls">
          <Button className="play-button" size="small" onClick={() => onPlaySmartWearableVideoShowcase?.(videoHash)}>
            <Icon name="video" />
            <span>{t('smart_wearable.play_showcase')}</span>
          </Button>
        </div>
      )
    }

    return null
  }, [
    asset,
    missingBodyShape,
    videoHash,
    isBabylonRenderer,
    isTryingOnEnabled,
    handleShowWearable,
    hasRepresentation,
    handleTryOut,
    onPlaySmartWearableVideoShowcase
  ])

  const [light, dark] = useMemo(
    () => Rarity.getGradient(asset.data.wearable?.rarity || asset.data.emote?.rarity || Rarity.COMMON),
    [asset.data.wearable?.rarity, asset.data.emote?.rarity]
  )

  const backgroundImage = useMemo(() => `radial-gradient(${light}, ${dark})`, [light, dark])

  const showWearablePreview = useMemo(() => isDraggable && !wearablePreviewError, [isDraggable, wearablePreviewError])

  const isEmote = useMemo(() => asset.category === NFTCategory.EMOTE, [asset.category])

  const className = useMemo(
    () =>
      classNames('Preview', 'rarity-background', {
        'is-loading-wearable-preview': isLoadingWearablePreview
      }),
    [isLoadingWearablePreview]
  )

  return (
    <div className={className} style={{ backgroundImage }}>
      {showWearablePreview ? (
        <>
          <DCLWearablePreview
            id="wearable-preview"
            baseUrl={config.get('WEARABLE_PREVIEW_URL')}
            background={Rarity.getColor(isNFT(asset) ? asset.data.wearable!.rarity : asset.rarity)}
            dev={!isUnityWearablePreviewEnabled ? config.is(Env.DEVELOPMENT) : undefined}
            emote={isTryingOnEnabled ? previewEmote : undefined}
            hair={hair}
            profile={avatar ? avatar.ethAddress : 'default'}
            skin={skin}
            unity={isUnityWearablePreviewEnabled}
            unityMode="marketplace"
            wheelZoom={isEmote ? 1.5 : undefined}
            wheelStart={isEmote ? 100 : undefined}
            onLoad={handleLoad}
            onError={handleError}
            {...wearablePreviewProps}
          />
          {isAvailableForMint && !isOwnerOfNFT && item ? (
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
              <Loader className="wearable-preview-loader" active size="large" />
            </Center>
          ) : (
            renderControls()
          )}
        </>
      ) : (
        <img alt={getAssetName(asset)} className="image" src={getAssetImage(asset)} />
      )}
      {hasBadges && children}
    </div>
  )
}
