import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { BodyShape, NFTCategory, Network, PreviewEmote, PreviewRenderer, PreviewType, PreviewUnityMode, Rarity } from '@dcl/schemas'
import { SocialEmoteAnimation } from '@dcl/schemas/dist/dapps/preview/social-emote-animation'
import { Env } from '@dcl/ui-env'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Center, Icon, Loader, Popup } from 'decentraland-ui'
import { AnimationControls, EmoteControls, WearablePreview, ZoomControls } from 'decentraland-ui2'
import { config } from '../../../config'
import { getAssetImage, getAssetName, isNFT } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import { getRarityWash } from '../../../utils/rarity'
import AvailableForMintPopup from '../AvailableForMintPopup'
import { colorToHex, getEthereumItemUrn } from '../utils'
import { PlayButton } from './PlayButton'
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
  isSmall,
  isLoadingVideoHash,
  isTryingOn,
  isUnityWearablePreviewEnabled,
  isSocialEmotesEnabled,
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
  const [socialEmote, setSocialEmote] = useState<SocialEmoteAnimation | undefined>(undefined)

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
    setRendererType(renderer as PreviewRenderer)
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

  const isBabylonRenderer = useMemo(() => rendererType === PreviewRenderer.BABYLON, [rendererType])

  const isSocialEmote = useMemo(() => {
    return !!isSocialEmotesEnabled && !!asset.data.emote?.outcomeType
  }, [asset, isSocialEmotesEnabled])

  const handleSelectSocialEmoteOutcome = useCallback((animation: SocialEmoteAnimation) => {
    setSocialEmote(animation)
  }, [])

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
            renderPlayButton={({ isPlaying, onToggle }) => {
              return isSocialEmote ? (
                <AnimationControls
                  wearablePreviewId="wearable-preview"
                  selectedAnimation={socialEmote}
                  onSelectAnimation={handleSelectSocialEmoteOutcome}
                  renderAnimationSelector={({ socialEmoteAnimations, onSelectAnimation }) => {
                    return (
                      <PlayButton
                        isPlaying={isPlaying}
                        onToggle={onToggle}
                        socialEmoteAnimations={socialEmoteAnimations}
                        onSelectAnimation={onSelectAnimation}
                      />
                    )
                  }}
                />
              ) : (
                <Button className="play-button" size="small" onClick={onToggle}>
                  {isPlaying ? <Icon name="stop" /> : <Icon name="play" />}
                  <span>{isPlaying ? t('wearable_preview.stop_emote') : t('wearable_preview.play_emote')}</span>
                </Button>
              )
            }}
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
    socialEmote,
    isSocialEmote,
    isSocialEmotesEnabled,
    handleSelectSocialEmoteOutcome,
    onPlaySmartWearableVideoShowcase
  ])

  const rarity = useMemo(() => {
    return asset.data.wearable?.rarity || asset.data.emote?.rarity || Rarity.COMMON
  }, [asset])

  /**
   * Only a card paints a stage behind the item; the other two surfaces paint nothing.
   *
   * A card takes the shop's softer rarity wash, which is what makes a grid read the way the shop's
   * does. The item page, told apart by `isDraggable`, used to flood the panel with the explorer
   * gradient and now paints nothing at all: the renderer composites its own shadow into the canvas
   * alpha, so the page's own field can be the scene's backdrop and the shadow can land on it. The
   * rarity still reads there, as a glow behind the frame that the detail pages draw. A small
   * thumbnail takes neither, because the wash is tuned for a card-sized box: at 48px its outer stop
   * covers almost the whole tile and buries the item's silhouette. That is every `isSmall` surface,
   * not just the rankings and recently-sold rows, and those two show rarity in a column anyway.
   */
  const backgroundImage = useMemo(() => (isSmall || isDraggable ? undefined : getRarityWash(rarity)), [isDraggable, isSmall, rarity])

  const isEmote = useMemo(() => asset.category === NFTCategory.EMOTE, [asset.category])

  const previewType = useMemo(() => {
    if (isEmote) return undefined

    return isTryingOnEnabled ? PreviewType.AVATAR : PreviewType.WEARABLE
  }, [isTryingOnEnabled, isEmote])

  const showWearablePreview = useMemo(() => isDraggable && !wearablePreviewError, [isDraggable, wearablePreviewError])

  const className = useMemo(
    () =>
      classNames('Preview', 'rarity-background', {
        'is-loading-wearable-preview': isLoadingWearablePreview,
        small: isSmall
      }),
    [isLoadingWearablePreview, isSmall]
  )

  return (
    <div className={className} style={{ backgroundImage }}>
      {showWearablePreview ? (
        <>
          <WearablePreview
            id="wearable-preview"
            // Transparent all the way down to the page's own field: the panel paints nothing either,
            // and a full-saturation rarity scene background would be too loud over it.
            disableBackground
            emote={isTryingOnEnabled || isUnityWearablePreviewEnabled ? previewEmote : undefined}
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
            unityMode={PreviewUnityMode.MARKETPLACE}
            unity={!isSocialEmote && isUnityWearablePreviewEnabled}
            socialEmote={isSocialEmote ? socialEmote : undefined}
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
