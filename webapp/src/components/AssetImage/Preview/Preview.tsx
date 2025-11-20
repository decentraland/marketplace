import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Network, PreviewType, Rarity, BodyShape, NFTCategory, PreviewEmote, PreviewRenderer } from '@dcl/schemas'
import { Env } from '@dcl/ui-env'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Center, Loader, Popup, Icon, EmoteControls, ZoomControls, WearablePreview } from 'decentraland-ui'
import { config } from '../../../config'
import { getAssetImage, getAssetName, isNFT } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import AvailableForMintPopup from '../AvailableForMintPopup'
import { getEthereumItemUrn, colorToHex } from '../utils'
import { Props } from './Preview.types'
import './Preview.css'

export const Preview: React.FC<Props> = ({
  asset,
  avatar,
  children,
  item,
  videoHash,
  wallet,
  isDraggable,
  isLoadingVideoHash,
  isTryingOn,
  isUnityWearablePreviewEnabled,
  hasBadges,
  hasFetchedVideoHash,
  onFetchSmartWearableVideoHash,
  onPlaySmartWearableVideoShowcase,
  onSetTryingOn
}) => {
  const [isTracked, setIsTracked] = useState(false)
  const [isLoadingWearablePreview, setIsLoadingWearablePreview] = useState(isDraggable ?? true)
  const [wearablePreviewError, setWearablePreviewError] = useState(false)
  const [rendererType, setRendererType] = useState<PreviewRenderer | undefined>(undefined)

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

  const handleLoad = useCallback((renderer?: PreviewRenderer) => {
    setRendererType(renderer)
    setWearablePreviewError(false)
    setIsLoadingWearablePreview(false)
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('Preview error:', error)
    setWearablePreviewError(true)
    setIsLoadingWearablePreview(false)
  }, [])

  const handleTryOut = useCallback(() => {
    if (!isTryingOn) {
      onSetTryingOn(true)
      setIsLoadingWearablePreview(true)
      getAnalytics()?.track(events.TOGGLE_PREVIEW_MODE, {
        mode: 'avatar',
        itemId: asset.itemId,
        contractAddress: asset.contractAddress
      })
    }
  }, [asset.itemId, asset.contractAddress, isTryingOn, onSetTryingOn])

  const handleShowWearable = useCallback(() => {
    if (isTryingOn) {
      onSetTryingOn(false)
      setIsLoadingWearablePreview(true)
      getAnalytics()?.track(events.TOGGLE_PREVIEW_MODE, {
        mode: 'wearable',
        itemId: asset.itemId,
        contractAddress: asset.contractAddress
      })
    }
  }, [asset.itemId, asset.contractAddress, isTryingOn, onSetTryingOn])

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
            urns: [ethereumUrn]
          }
        : {
            contractAddress: asset.contractAddress,
            itemId,
            tokenId
          },
    [asset, ethereumUrn, itemId, tokenId]
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

  const isUnityRenderer = useMemo(() => rendererType === PreviewRenderer.UNITY, [rendererType])
  const isBabylonRenderer = useMemo(() => rendererType === PreviewRenderer.BABYLON, [rendererType])

  const previewEmote = useMemo(() => {
    const poses = [PreviewEmote.FASHION, PreviewEmote.FASHION_2, PreviewEmote.FASHION_3]
    return poses[(Math.random() * poses.length) | 0]
  }, [])

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
    if (asset.category === NFTCategory.WEARABLE) {
      return (
        <>
          {isBabylonRenderer ? (
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
          ) : null}
          {asset.data.wearable?.isSmart && asset.urn && videoHash ? (
            <div className="asset-wearable-controls">
              <Button className="play-button" size="small" onClick={() => onPlaySmartWearableVideoShowcase?.(videoHash)}>
                <Icon name="video" />
                <span>{t('smart_wearable.play_showcase')}</span>
              </Button>
            </div>
          ) : null}
        </>
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

  const rarity = useMemo(() => {
    return asset.data.wearable?.rarity || asset.data.emote?.rarity || Rarity.COMMON
  }, [asset])

  const [light, dark] = useMemo(() => Rarity.getGradient(rarity), [rarity])

  const backgroundImage = useMemo(() => `radial-gradient(${light}, ${dark})`, [light, dark])

  const isEmote = useMemo(() => asset.category === NFTCategory.EMOTE, [asset.category])

  const previewType = useMemo(() => {
    if (isEmote) return undefined

    return isTryingOnEnabled ? PreviewType.AVATAR : PreviewType.WEARABLE
  }, [isTryingOnEnabled, isEmote])

  const showWearablePreview = useMemo(() => isDraggable && !wearablePreviewError, [isDraggable, wearablePreviewError])

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
          <WearablePreview
            id="wearable-preview"
            background={Rarity.getColor(rarity)}
            emote={isTryingOnEnabled || isUnityRenderer ? previewEmote : undefined}
            hair={hair}
            profile={avatar ? avatar.ethAddress : 'default'}
            skin={skin}
            type={previewType}
            wheelZoom={isEmote ? 1.5 : undefined}
            wheelStart={isEmote ? 100 : undefined}
            onLoad={handleLoad}
            onError={handleError}
            {...wearablePreviewProps}
            dev={config.is(Env.DEVELOPMENT)}
            unityMode={'marketplace'}
            unity={isUnityWearablePreviewEnabled}
            baseUrl="https://wearable-preview-9a1o9dh06-decentraland1.vercel.app"
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
