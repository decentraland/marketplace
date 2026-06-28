import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { Network, PreviewMessageType, PreviewOptions, PreviewUnityMode, Rarity, sendMessage } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { Loader } from 'decentraland-ui'
import { WearablePreview } from 'decentraland-ui2'
import { config } from '../../config'
import { getWallet } from '../../modules/wallet/selectors'
import { getRarityBackgroundColor, getRarityBackgroundGradient } from '../../utils/rarity'
import './EmotePreviewPlayer.css'

const PREVIEW_IFRAME_ID = 'emote-preview-player-iframe'

export type EmotePreviewSource = {
  contractAddress?: string
  itemId?: string | null
  tokenId?: string | null
  urn?: string | null
  network?: Network
  rarity?: Rarity
}

type EmotePreviewPlayerContextValue = {
  show: (target: HTMLElement, source: EmotePreviewSource) => void
  hide: () => void
}

const EmotePreviewPlayerContext = createContext<EmotePreviewPlayerContextValue | null>(null)

export const useEmotePreviewPlayer = (): EmotePreviewPlayerContextValue | null => useContext(EmotePreviewPlayerContext)

type Rect = { top: number; left: number; width: number; height: number }

type ProviderProps = {
  enabled?: boolean
  children: React.ReactNode
}

type PreviewEnvConfig = {
  profile: string
  peerUrl: string
  marketplaceServerUrl: string
}

const sourceToOptions = (src: EmotePreviewSource, env: PreviewEnvConfig): PreviewOptions => {
  const base: PreviewOptions = {
    profile: env.profile,
    peerUrl: env.peerUrl,
    marketplaceServerUrl: env.marketplaceServerUrl,
    background: getRarityBackgroundColor(src.rarity ?? Rarity.COMMON)
  }
  if (src.network === Network.ETHEREUM && src.urn) {
    return { ...base, urns: [src.urn] }
  }
  return {
    ...base,
    contractAddress: src.contractAddress ?? null,
    itemId: src.itemId ?? null,
    tokenId: src.tokenId ?? null
  }
}

const dispatchUpdate = (src: EmotePreviewSource, env: PreviewEnvConfig): boolean => {
  const iframe = document.getElementById(PREVIEW_IFRAME_ID) as HTMLIFrameElement | null
  if (!iframe?.contentWindow) return false
  sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, {
    options: sourceToOptions(src, env)
  })
  return true
}

// Stable identity of an emote, matching the discriminator used in
// sourceToOptions. Used to tell whether a hover targets the emote that's
// already rendered in the iframe (so we don't wait on a LOAD that will
// never come) versus a genuinely new one.
const keyOf = (src: EmotePreviewSource): string => {
  if (src.network === Network.ETHEREUM && src.urn) {
    return `eth:${src.urn}`
  }
  return `${src.contractAddress ?? ''}:${src.itemId ?? src.tokenId ?? ''}`
}

export const EmotePreviewPlayerProvider: React.FC<ProviderProps> = ({ enabled = true, children }) => {
  const [rect, setRect] = useState<Rect | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [rarity, setRarity] = useState<Rarity>(Rarity.COMMON)
  const [isControllable, setIsControllable] = useState(false)
  const [isEmoteLoading, setIsEmoteLoading] = useState(false)
  const targetRef = useRef<HTMLElement | null>(null)
  const pendingSourceRef = useRef<EmotePreviewSource | null>(null)
  const hasInitiallyLoadedRef = useRef(false)
  // Identity of the emote the user is currently hovering, and of the one the
  // iframe last finished loading. We drive the spinner off these instead of
  // counting LOAD events: re-hovering an already-loaded emote (or rapid
  // enter/exit on the same card) sends an UPDATE with identical options, so
  // the iframe doesn't rebuild its scene and never emits a LOAD — a LOAD
  // counter would then drift and leave the spinner stuck forever.
  const currentKeyRef = useRef<string | null>(null)
  const loadedKeyRef = useRef<string | null>(null)

  const wallet = useSelector(getWallet)
  const profiles = useSelector(getProfiles)

  // Resolve the user's profile address whenever wallet/profile data changes.
  // We DON'T pass `profile` to the React WearablePreview component (the
  // iframe is mounted once with profile=default to keep its URL stable and
  // avoid full reloads when the profile becomes available mid-session).
  // Instead we inject `profile` into every UPDATE we send on hover, so the
  // emote is rendered on the user's avatar when they're logged in.
  const profileAddress = useMemo(() => {
    if (wallet?.address && profiles[wallet.address]?.avatars[0]) {
      return wallet.address.toLowerCase()
    }
    return 'default'
  }, [wallet?.address, profiles])

  const envConfig = useMemo<PreviewEnvConfig>(
    () => ({
      profile: profileAddress,
      peerUrl: config.get('PEER_URL'),
      marketplaceServerUrl: config.get('MARKETPLACE_SERVER_URL')
    }),
    [profileAddress]
  )

  // Source of truth for whether the iframe should run against testnets:
  // tied to the configured peer URL, not to VITE_DCL_DEFAULT_ENV. Lets you
  // copy prod values into dev.json and have the iframe follow.
  const isPreviewDev = useMemo(() => !envConfig.peerUrl.includes('decentraland.org'), [envConfig.peerUrl])

  // Track the hovered target's position every frame while visible so the overlay
  // follows the card image as it shrinks on hover and as the page scrolls.
  useEffect(() => {
    if (!isVisible) return
    let rafId = 0
    const tick = () => {
      const el = targetRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        setRect(prev => {
          if (prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height) {
            return prev
          }
          return { top: r.top, left: r.left, width: r.width, height: r.height }
        })
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isVisible])

  const show = useCallback(
    (target: HTMLElement, source: EmotePreviewSource) => {
      targetRef.current = target
      setRarity(source.rarity ?? Rarity.COMMON)
      const r = target.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
      setIsVisible(true)
      const key = keyOf(source)
      currentKeyRef.current = key
      // If this emote is already rendered in the iframe the UPDATE won't
      // trigger a rebuild (no LOAD will follow), so don't show a spinner that
      // would never clear. Otherwise wait for its LOAD.
      setIsEmoteLoading(key !== loadedKeyRef.current)
      if (isControllable) {
        dispatchUpdate(source, envConfig)
        pendingSourceRef.current = null
      } else {
        pendingSourceRef.current = source
      }
    },
    [isControllable, envConfig]
  )

  const hide = useCallback(() => {
    targetRef.current = null
    setIsVisible(false)
    setIsEmoteLoading(false)
    pendingSourceRef.current = null
    // Keep loadedKeyRef so re-hovering the same emote stays instant.
  }, [])

  // Flush any pending hover request once the iframe is controllable.
  useEffect(() => {
    if (isControllable && pendingSourceRef.current) {
      dispatchUpdate(pendingSourceRef.current, envConfig)
      pendingSourceRef.current = null
    }
  }, [isControllable, envConfig])

  // When the provider is disabled (user left the emotes section) the overlay
  // and its iframe unmount. Reset the lifecycle refs/state so that when the
  // section is re-entered a fresh iframe boots and is treated as not-yet
  // controllable — otherwise the first hover would postMessage an UPDATE to
  // an iframe that hasn't finished initializing and the emote silently fails.
  useEffect(() => {
    if (!enabled) {
      hasInitiallyLoadedRef.current = false
      currentKeyRef.current = null
      loadedKeyRef.current = null
      targetRef.current = null
      pendingSourceRef.current = null
      setIsControllable(false)
      setIsVisible(false)
      setIsEmoteLoading(false)
    }
  }, [enabled])

  // onLoad fires once on initial iframe boot (with the default profile, no
  // emote) and AGAIN every time an UPDATE swaps the urn/itemId — the iframe
  // rebuilds the Babylon scene and re-emits LOAD. The first LOAD only marks
  // the iframe controllable. Subsequent LOADs mean an emote scene finished
  // rendering, so we record what's now loaded and clear the spinner.
  const handlePreviewLoad = useCallback(() => {
    if (!hasInitiallyLoadedRef.current) {
      hasInitiallyLoadedRef.current = true
      setIsControllable(true)
      return
    }
    loadedKeyRef.current = currentKeyRef.current
    setIsEmoteLoading(false)
  }, [])

  // If the iframe fails to render an emote it emits ERROR instead of LOAD, so
  // clear the spinner here too — otherwise a failed load would leave it stuck.
  const handlePreviewError = useCallback(() => {
    setIsEmoteLoading(false)
  }, [])

  const contextValue = useMemo<EmotePreviewPlayerContextValue>(() => ({ show, hide }), [show, hide])

  const overlayStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!isVisible || !rect) return undefined
    const [light, dark] = getRarityBackgroundGradient(rarity)
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      backgroundImage: `radial-gradient(${light}, ${dark})`
    }
  }, [isVisible, rect, rarity])

  const overlay = enabled ? (
    <div className={`EmotePreviewPlayer ${isVisible ? 'is-visible' : 'is-warming'}`} style={overlayStyle} aria-hidden>
      <WearablePreview
        id={PREVIEW_IFRAME_ID}
        profile="default"
        peerUrl={envConfig.peerUrl}
        marketplaceServerUrl={envConfig.marketplaceServerUrl}
        background={getRarityBackgroundColor(Rarity.COMMON)}
        wheelZoom={1.5}
        wheelStart={100}
        disableAutoRotate
        disableFadeEffect
        // The iframe uses `?env=dev` (set by dev={true}) to talk to testnets
        // (Amoy for Matic, Sepolia for Ethereum). We resolve "is dev" from
        // the configured PEER_URL — if it's pointing at .org we want the
        // iframe in prod mode regardless of VITE_DCL_DEFAULT_ENV, otherwise
        // contractAddress+itemId from the prod catalog won't resolve.
        dev={isPreviewDev}
        unityMode={PreviewUnityMode.MARKETPLACE}
        onLoad={handlePreviewLoad}
        onError={handlePreviewError}
      />
      {isVisible && isEmoteLoading ? <Loader className="EmotePreviewPlayer__spinner" active size="large" /> : null}
    </div>
  ) : null

  return (
    <EmotePreviewPlayerContext.Provider value={contextValue}>
      {children}
      {overlay && typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </EmotePreviewPlayerContext.Provider>
  )
}
