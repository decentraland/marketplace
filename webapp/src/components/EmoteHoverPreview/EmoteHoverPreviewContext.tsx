import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, memo } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { Avatar, NFTCategory, Rarity } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { WearablePreview } from 'decentraland-ui2'
import { Asset } from '../../modules/asset/types'
import { isNFT } from '../../modules/asset/utils'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import './EmoteHoverPreview.css'

type EmotePreviewAsset = {
  contractAddress: string
  itemId?: string
  tokenId?: string
  rarity: Rarity
}

// Memoized preview content to prevent WearablePreview from remounting on parent re-renders
const PreviewContent = memo(function PreviewContent({
  contractAddress,
  itemId,
  tokenId,
  profile,
  rarity,
  onLoad,
  onError
}: {
  contractAddress: string
  itemId?: string
  tokenId?: string
  profile: string
  rarity: Rarity
  onLoad: () => void
  onError: (error: Error) => void
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const loadCountRef = useRef(0)

  const [light, dark] = useMemo(() => Rarity.getGradient(rarity), [rarity])
  const backgroundStyle = useMemo(() => ({ background: `radial-gradient(${light}, ${dark})` }), [light, dark])
  const backgroundColor = useMemo(() => Rarity.getColor(rarity), [rarity])

  // Reset loaded state when asset changes
  useEffect(() => {
    setIsLoaded(false)
    loadCountRef.current = 0
  }, [contractAddress, itemId, tokenId])

  const handleLoad = useCallback(() => {
    loadCountRef.current += 1
    // WearablePreview calls onLoad twice, so we wait for the second call
    // to ensure Babylon is fully rendered
    if (loadCountRef.current >= 2) {
      console.log('[PreviewContent] Fully loaded (2nd onLoad)')
      setIsLoaded(true)
    }
    onLoad()
  }, [onLoad])

  return (
    <div className="EmoteHoverPreview__content" style={backgroundStyle}>
      {/* Loading spinner shown until WearablePreview is fully loaded */}
      <div
        className="EmoteHoverPreview__loader"
        style={{
          opacity: isLoaded ? 0 : 1,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <div className="EmoteHoverPreview__spinner" />
      </div>
      {/* WearablePreview fades in when loaded */}
      <div
        className="EmoteHoverPreview__preview"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <WearablePreview
          id="emote-hover-preview"
          contractAddress={contractAddress}
          itemId={itemId}
          tokenId={tokenId}
          profile={profile}
          background={backgroundColor}
          wheelZoom={1.5}
          wheelStart={100}
          onLoad={handleLoad}
          onError={onError}
        />
      </div>
    </div>
  )
})

type EmoteHoverPreviewContextType = {
  showPreview: (asset: Asset, targetRect: DOMRect) => void
  hidePreview: () => void
  isPreviewActive: boolean
  isAssetBeingPreviewed: (contractAddress: string, itemId?: string, tokenId?: string) => boolean
}

const EmoteHoverPreviewContext = createContext<EmoteHoverPreviewContextType | null>(null)

const HOVER_DELAY_MS = 200 // Small delay to prevent flickering on quick mouse movements
const HIDE_DELAY_MS = 100 // Small delay before hiding to allow mouse to move to preview
const HOVER_THUMBNAIL_HEIGHT = 161 // Height of thumbnail in hover state (from AssetCard.css)

export const EmoteHoverPreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAsset, setActiveAsset] = useState<EmotePreviewAsset | null>(null)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Get current user's avatar for the preview
  const wallet = useSelector(getWallet)
  const profiles = useSelector((state: RootState) => getProfiles(state))

  const userAvatar: Avatar | undefined = useMemo(() => {
    if (wallet && profiles[wallet.address]) {
      const avatar = profiles[wallet.address].avatars[0]
      console.log('[EmoteHoverPreview] userAvatar computed:', avatar?.ethAddress)
      return avatar
    }
    console.log('[EmoteHoverPreview] userAvatar computed: undefined')
    return undefined
  }, [wallet, profiles])

  const showTimeoutRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)
  const portalContainerRef = useRef<HTMLDivElement | null>(null)

  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div')
    container.id = 'emote-hover-preview-portal'
    document.body.appendChild(container)
    portalContainerRef.current = container

    return () => {
      if (portalContainerRef.current) {
        document.body.removeChild(portalContainerRef.current)
      }
    }
  }, [])

  // Hide preview on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        setIsVisible(false)
        setActiveAsset(null)
        setTargetRect(null)
        clearTimeouts()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible, clearTimeouts])

  const showPreview = useCallback(
    (asset: Asset, rect: DOMRect) => {
      // Only show preview for emotes
      if (asset.category !== NFTCategory.EMOTE) {
        return
      }

      clearTimeouts()

      const rarity = asset.data.emote?.rarity || Rarity.COMMON

      // Prepare asset info
      const previewAsset: EmotePreviewAsset = {
        contractAddress: asset.contractAddress,
        rarity
      }

      if (isNFT(asset)) {
        previewAsset.tokenId = asset.tokenId
      } else if ('itemId' in asset) {
        previewAsset.itemId = asset.itemId
      }

      // Check if it's the same asset - if so, just cancel hide
      if (
        activeAsset?.contractAddress === previewAsset.contractAddress &&
        activeAsset?.itemId === previewAsset.itemId &&
        activeAsset?.tokenId === previewAsset.tokenId
      ) {
        console.log('[EmoteHoverPreview] Same asset, just making visible again')
        setIsVisible(true)
        return
      }

      // Show with delay
      showTimeoutRef.current = window.setTimeout(() => {
        console.log('[EmoteHoverPreview] Setting new asset:', previewAsset.contractAddress, previewAsset.itemId)
        setActiveAsset(previewAsset)
        setTargetRect(rect)
        setIsVisible(true)
      }, HOVER_DELAY_MS)
    },
    [activeAsset, clearTimeouts]
  )

  const hidePreview = useCallback(() => {
    console.log('[EmoteHoverPreview] hidePreview called')
    clearTimeouts()

    // Hide with small delay to allow mouse movement
    hideTimeoutRef.current = window.setTimeout(() => {
      console.log('[EmoteHoverPreview] Setting isVisible to false')
      setIsVisible(false)
      // Delay clearing the asset to allow fade out animation
      setTimeout(() => {
        console.log('[EmoteHoverPreview] Clearing activeAsset')
        setActiveAsset(null)
        setTargetRect(null)
      }, 150)
    }, HIDE_DELAY_MS)
  }, [clearTimeouts])

  const handlePreviewLoad = useCallback(() => {
    console.log('[EmoteHoverPreview] onLoad called')
    // No state update needed - just log for debugging
  }, [])

  const handlePreviewError = useCallback((error: Error) => {
    console.error('Emote hover preview error:', error)
  }, [])

  const handlePreviewMouseEnter = useCallback(() => {
    clearTimeouts()
    setIsVisible(true)
  }, [clearTimeouts])

  const handlePreviewMouseLeave = useCallback(() => {
    hidePreview()
  }, [hidePreview])

  // Check if a specific asset is currently being previewed
  const isAssetBeingPreviewed = useCallback(
    (contractAddress: string, itemId?: string, tokenId?: string) => {
      if (!isVisible || !activeAsset) return false

      return activeAsset.contractAddress === contractAddress && activeAsset.itemId === itemId && activeAsset.tokenId === tokenId
    },
    [isVisible, activeAsset]
  )

  const contextValue: EmoteHoverPreviewContextType = {
    showPreview,
    hidePreview,
    isPreviewActive: isVisible,
    isAssetBeingPreviewed
  }

  // Memoize the profile string to prevent unnecessary re-renders
  const profileAddress = useMemo(() => (userAvatar ? userAvatar.ethAddress : 'default'), [userAvatar])

  // Memoize style object
  const previewStyle = useMemo((): React.CSSProperties => {
    if (!targetRect) {
      return { display: 'none' }
    }

    return {
      position: 'fixed',
      top: targetRect.top,
      left: targetRect.left,
      width: targetRect.width,
      height: HOVER_THUMBNAIL_HEIGHT,
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 0.15s ease-in-out'
    }
  }, [targetRect, isVisible])

  const renderPreview = () => {
    if (!portalContainerRef.current || !activeAsset || !targetRect) {
      return null
    }

    console.log('[EmoteHoverPreview] Rendering preview for:', activeAsset.contractAddress, activeAsset.itemId, 'isVisible:', isVisible)

    return createPortal(
      <div className="EmoteHoverPreview" style={previewStyle} onMouseEnter={handlePreviewMouseEnter} onMouseLeave={handlePreviewMouseLeave}>
        <PreviewContent
          key={`${activeAsset.contractAddress}-${activeAsset.itemId || activeAsset.tokenId}`}
          contractAddress={activeAsset.contractAddress}
          itemId={activeAsset.itemId}
          tokenId={activeAsset.tokenId}
          profile={profileAddress}
          rarity={activeAsset.rarity}
          onLoad={handlePreviewLoad}
          onError={handlePreviewError}
        />
      </div>,
      portalContainerRef.current
    )
  }

  return (
    <EmoteHoverPreviewContext.Provider value={contextValue}>
      {children}
      {renderPreview()}
    </EmoteHoverPreviewContext.Provider>
  )
}

export const useEmoteHoverPreview = (): EmoteHoverPreviewContextType => {
  const context = useContext(EmoteHoverPreviewContext)
  if (!context) {
    throw new Error('useEmoteHoverPreview must be used within EmoteHoverPreviewProvider')
  }
  return context
}

// Optional hook that doesn't throw if context is not available (for gradual adoption)
export const useEmoteHoverPreviewOptional = (): EmoteHoverPreviewContextType | null => {
  return useContext(EmoteHoverPreviewContext)
}
