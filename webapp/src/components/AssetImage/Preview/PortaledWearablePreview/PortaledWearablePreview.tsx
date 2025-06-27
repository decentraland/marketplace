import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Env } from '@dcl/ui-env'
import { WearablePreview } from 'decentraland-ui'
import { config } from '../../../../config'
import { PortaledWearablePreviewProps } from './PortaledWearablePreview.types'

const DEFAULT_RECT = {
  top: 0,
  left: 0,
  width: 50,
  height: 50
}

export const PortaledWearablePreview: React.FC<PortaledWearablePreviewProps> = props => {
  const {
    containerRef,
    profile,
    isUnityWearablePreviewEnabled,
    hasLoadedInitialFlags,
    isLoadingWearablePreview = true,
    ...restProps
  } = props
  const [position, setPosition] = useState<DOMRect | typeof DEFAULT_RECT>(DEFAULT_RECT)

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return

    let frameId: number

    const updatePosition = () => {
      setPosition(el.getBoundingClientRect())
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
        visibility: isLoadingWearablePreview ? 'hidden' : 'visible',
        borderRadius: 12,
        overflow: 'hidden',
        willChange: 'transform, top, left'
      }}
    >
      <WearablePreview
        {...restProps}
        profile={profile || 'default1'}
        baseUrl={config.get('WEARABLE_PREVIEW_URL')}
        dev={!isUnityWearablePreviewEnabled ? config.is(Env.DEVELOPMENT) : undefined}
        unityMode={containerRef?.current ? 'marketplace' : 'profile'}
        unity={isUnityWearablePreviewEnabled}
      />
    </div>,
    container
  )
}
