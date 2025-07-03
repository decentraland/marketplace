import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Env } from '@dcl/ui-env'
import { WearablePreview } from 'decentraland-ui'
import { config } from '../../config'
import { PortalWearablePreviewProps } from './PortalWearablePreview.types'

const DEFAULT_RECT = {
  top: 0,
  left: 0,
  width: 50,
  height: 50
}

export const PortalWearablePreview: React.FC<PortalWearablePreviewProps> = props => {
  const {
    containerRef,
    profile,
    isUnityWearablePreviewEnabled,
    hasLoadedInitialFlags,
    isLoadingWearablePreview = true,
    onSetWearablePreviewController,
    ...restProps
  } = props
  const [position, setPosition] = useState<DOMRect | typeof DEFAULT_RECT>(DEFAULT_RECT)
  const [hasSetController, setHasSetController] = useState(false)

  // Call onSetWearablePreviewController when props.id is first received
  useEffect(() => {
    if (props.id && !hasSetController && onSetWearablePreviewController) {
      onSetWearablePreviewController(WearablePreview.createController(props.id))
      setHasSetController(true)
    }
  }, [props.id, hasSetController, onSetWearablePreviewController])

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return

    let frameId: number

    const updatePosition = () => {
      const rect = el.getBoundingClientRect()
      setPosition({
        top: rect.top,
        left: rect.left,
        width: Math.max(rect.width, DEFAULT_RECT.width),
        height: Math.max(rect.height, DEFAULT_RECT.height)
      })
      frameId = 0
    }

    const onScrollOrResize = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(updatePosition)
      }
    }

    updatePosition()
    const resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(el)

    window.addEventListener('scroll', onScrollOrResize)
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('touchmove', onScrollOrResize, { passive: true })
    window.addEventListener('wheel', onScrollOrResize, { passive: true })
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('touchmove', onScrollOrResize)
      window.removeEventListener('wheel', onScrollOrResize)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [containerRef])

  const container = document.getElementById('wearable-preview-container')
  if (!container || !hasLoadedInitialFlags) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        pointerEvents: 'auto',
        opacity: isLoadingWearablePreview ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
        borderRadius: 12,
        overflow: 'hidden',
        willChange: 'transform, top, left'
      }}
    >
      <WearablePreview
        {...restProps}
        baseUrl={config.get('WEARABLE_PREVIEW_URL')}
        dev={!isUnityWearablePreviewEnabled ? config.is(Env.DEVELOPMENT) : undefined}
        profile={profile}
        unityMode={containerRef?.current ? 'marketplace' : undefined}
        unity={isUnityWearablePreviewEnabled}
      />
    </div>,
    container
  )
}
