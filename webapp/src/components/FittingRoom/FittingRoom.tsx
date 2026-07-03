import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { BigNumber } from 'ethers'
import { Network, PreviewMessageType, PreviewType, PreviewUnityMode, sendMessage } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon, Loader } from 'decentraland-ui'
import { WearablePreview } from 'decentraland-ui2'
import { config } from '../../config'
import { getIsUnityWearablePreviewEnabled } from '../../modules/features/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import { formatWeiToAssetCard } from '../AssetCard/utils'
import { useCart } from '../Cart'
import { Mana } from '../Mana'
import AnimatedBackground from './AnimatedBackground/AnimatedBackground'
import './FittingRoom.css'

const IFRAME_ID = 'fitting-room-iframe'

// Resizable drawer bounds; the current width lives in the CSS variable
// `--fitting-room-width` so the drawer AND the pushed page content follow it.
const WIDTH_STORAGE_KEY = 'fitting-room-width'
const DEFAULT_WIDTH = 380
const MIN_WIDTH = 300
const MAX_WIDTH = 720

const clampWidth = (width: number): number => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width))

export type TryOnItem = {
  name: string
  contractAddress?: string
  itemId?: string | null
  tokenId?: string | null
  urn?: string | null
  network?: Network
}

type FittingRoomContextValue = {
  tryOn: (item: TryOnItem) => void
  tryOnCart: () => void
}

const FittingRoomContext = createContext<FittingRoomContextValue | null>(null)

export const useFittingRoom = (): FittingRoomContextValue | null => useContext(FittingRoomContext)

const keyOf = (item: TryOnItem | null): string =>
  item ? `${item.contractAddress ?? ''}:${item.itemId ?? item.tokenId ?? ''}:${item.urn ?? ''}` : ''

// Demo: a "fitting room" drawer that slides in from the right, showing the
// user's avatar in the same Unity previewer as the item detail page. Two ways
// in: the try-on button on a card (single item, Unity marketplace mode) or
// the cart's try-on button (the cart's wearables combined on the avatar,
// Unity BUILDER mode — items sharing a body slot replace each other via the
// toggle chips). The initial config travels in the iframe URL; outfit toggles
// go through postMessage (SetUrns + Reload) so the scene updates in place.
// While open, the app content is pushed left (body class) so BUY MANA and
// the cart stay visible.
export const FittingRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'single' | 'cart'>('single')
  const [previewItem, setPreviewItem] = useState<TryOnItem | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // Cart mode keeps ONE stable iframe: the initial outfit is frozen into the
  // mount URL and every toggle afterwards goes through a postMessage UPDATE
  // (Babylon rebuilds the scene in place — no iframe reload, no flicker).
  const [mountUrns, setMountUrns] = useState<string[]>([])
  const [isCartIframeReady, setIsCartIframeReady] = useState(false)
  const lastAppliedUrnsRef = useRef<string | null>(null)
  const isOpenRef = useRef(false)
  const modeRef = useRef<'single' | 'cart'>('single')

  // Drawer width — user-resizable by dragging the left edge, persisted.
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem(WIDTH_STORAGE_KEY))
    return Number.isFinite(stored) && stored > 0 ? clampWidth(stored) : DEFAULT_WIDTH
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--fitting-room-width', `${drawerWidth}px`)
  }, [drawerWidth])

  const handleResizeStart = useCallback((event: React.PointerEvent) => {
    event.preventDefault()
    document.body.classList.add('fitting-room-resizing')
    const handleMove = (moveEvent: PointerEvent) => {
      // Write straight to the CSS variable while dragging (no re-renders).
      const width = clampWidth(window.innerWidth - moveEvent.clientX)
      document.documentElement.style.setProperty('--fitting-room-width', `${width}px`)
    }
    const handleUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      document.body.classList.remove('fitting-room-resizing')
      const width = clampWidth(window.innerWidth - upEvent.clientX)
      setDrawerWidth(width)
      try {
        window.localStorage.setItem(WIDTH_STORAGE_KEY, String(width))
      } catch {
        // ignore persistence errors (demo only)
      }
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }, [])

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  const { items, removeItem } = useCart()
  // Cart entries that can be worn (bundles have no urn and are skipped).
  const wearableItems = useMemo(() => items.filter(item => !!item.urn), [items])

  const wallet = useSelector(getWallet)
  const profiles = useSelector(getProfiles)
  // Same renderer as the item detail page — Unity has the nicer avatar toon shader.
  const isUnityEnabled = useSelector(getIsUnityWearablePreviewEnabled)
  // Dress the user's own avatar when they're logged in and have a profile.
  // Logged out: pin a FIXED default ('default1') — plain 'default' makes
  // wearable-preview pick a RANDOM base avatar on every iframe boot, so each
  // outfit toggle (which remounts the iframe) would change the mannequin.
  const profileAddress = useMemo(() => {
    if (wallet?.address && profiles[wallet.address]?.avatars[0]) {
      return wallet.address.toLowerCase()
    }
    return 'default1'
  }, [wallet?.address, profiles])

  const peerUrl = config.get('PEER_URL')
  const marketplaceServerUrl = config.get('MARKETPLACE_SERVER_URL')
  const isPreviewDev = useMemo(() => !peerUrl.includes('decentraland.org'), [peerUrl])

  // Push the app content left while the drawer is open (keeps BUY MANA + cart visible).
  useEffect(() => {
    document.body.classList.toggle('fitting-room-open', isOpen)
    return () => document.body.classList.remove('fitting-room-open')
  }, [isOpen])

  const tryOn = useCallback((item: TryOnItem) => {
    setMode('single')
    modeRef.current = 'single'
    setPreviewItem(prev => {
      if (keyOf(prev) !== keyOf(item)) {
        setIsLoading(true)
      }
      return item
    })
    setIsOpen(true)
  }, [])

  // Open with the whole cart on: pick the first item of each body slot so
  // conflicting items don't silently override each other.
  const tryOnCart = useCallback(() => {
    const seenCategories = new Set<string>()
    const selection: string[] = []
    for (const item of wearableItems) {
      if (item.category) {
        if (seenCategories.has(item.category)) continue
        seenCategories.add(item.category)
      }
      selection.push(item.id)
    }
    const selectionUrns = wearableItems.filter(item => selection.includes(item.id)).map(item => item.urn as string)

    const isFreshMount = !isOpenRef.current || modeRef.current !== 'cart'
    setSelectedIds(selection)
    setMode('cart')
    modeRef.current = 'cart'
    if (isFreshMount) {
      // A new iframe boots with this outfit in its URL; later changes are
      // pushed via postMessage instead of remounting.
      setMountUrns(selectionUrns)
      lastAppliedUrnsRef.current = selectionUrns.join('|')
      setIsCartIframeReady(false)
      setIsLoading(true)
    }
    setIsOpen(true)
  }, [wearableItems])

  // Toggle a cart item on the avatar; turning one on kicks out whatever is
  // already selected in the same body slot (that's how avatars work anyway).
  const handleToggleItem = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        if (prev.includes(id)) {
          return prev.filter(selectedId => selectedId !== id)
        }
        const toggled = wearableItems.find(item => item.id === id)
        const next = prev.filter(selectedId => {
          const selected = wearableItems.find(item => item.id === selectedId)
          return !(toggled?.category && selected?.category && selected.category === toggled.category)
        })
        return [...next, id]
      })
    },
    [wearableItems]
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setPreviewItem(null)
    setSelectedIds([])
    setMountUrns([])
    setIsCartIframeReady(false)
    lastAppliedUrnsRef.current = null
    setIsLoading(false)
  }, [])

  // Every LOAD (boot or in-place scene reload) clears the spinner; the first
  // one also marks the iframe as ready to receive outfit updates.
  const handleLoad = useCallback(() => {
    setIsCartIframeReady(true)
    setIsLoading(false)
  }, [])
  const handleError = useCallback(() => setIsLoading(false), [])

  const contextValue = useMemo<FittingRoomContextValue>(() => ({ tryOn, tryOnCart }), [tryOn, tryOnCart])

  // The outfit rendered on the avatar (cart mode); ignores items removed from
  // the cart after being selected.
  const selectedUrns = useMemo(
    () => wearableItems.filter(item => selectedIds.includes(item.id)).map(item => item.urn as string),
    [wearableItems, selectedIds]
  )

  // Price of the outfit currently on the avatar — follows toggles and removals.
  const selectedTotalWei = useMemo(
    () =>
      wearableItems
        .filter(item => selectedIds.includes(item.id))
        .reduce((acc, item) => acc.add(BigNumber.from(item.price || '0')), BigNumber.from(0))
        .toString(),
    [wearableItems, selectedIds]
  )

  // Outfit changes while the drawer is open go through postMessage — the
  // wearable-preview host turns them into SetUrns + Reload on the Unity side,
  // so the scene rebuilds in place (no iframe remount, no flicker).
  useEffect(() => {
    if (mode !== 'cart' || !isOpen || !isCartIframeReady) return
    const joined = selectedUrns.join('|')
    if (joined === lastAppliedUrnsRef.current) return
    const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null
    if (!iframe?.contentWindow) return
    lastAppliedUrnsRef.current = joined
    setIsLoading(true)
    sendMessage(iframe.contentWindow, PreviewMessageType.UPDATE, { options: { urns: selectedUrns } })
  }, [mode, isOpen, isCartIframeReady, selectedUrns])

  const previewProps = useMemo(() => {
    if (mode === 'cart') {
      // Unity's BUILDER mode is the only renderer mode that dresses an avatar
      // with an arbitrary set of urns (slot-deduplicated renderer-side) while
      // keeping the toon shader: marketplace mode asserts on exactly one urn
      // and profile mode ignores urns entirely. `type` only matters for the
      // Babylon fallback when the unity flag is off. The urns here are the
      // MOUNT outfit — later changes go via postMessage, not prop changes
      // (prop changes would rewrite the iframe URL and reload it).
      return {
        urns: mountUrns.length > 0 ? mountUrns : undefined,
        unity: isUnityEnabled,
        unityMode: PreviewUnityMode.BUILDER,
        type: PreviewType.AVATAR
      }
    }
    if (!previewItem) return null
    // Same addressing as the detail page's try-on: Ethereum items go by urn,
    // everything else by contract + item/token id. Unity = the detail page's
    // toon-shader item view.
    return {
      unity: isUnityEnabled,
      unityMode: PreviewUnityMode.MARKETPLACE,
      ...(previewItem.network === Network.ETHEREUM && previewItem.urn
        ? { urns: [previewItem.urn] }
        : {
            contractAddress: previewItem.contractAddress,
            itemId: previewItem.itemId ?? undefined,
            tokenId: previewItem.tokenId ?? undefined
          })
    }
  }, [mode, previewItem, mountUrns, isUnityEnabled])

  // Cart mode keeps a STABLE key — the iframe survives outfit toggles.
  const previewKey = mode === 'cart' ? `cart:${profileAddress}` : `single:${profileAddress}:${keyOf(previewItem)}`

  const showPreview = isOpen && (mode === 'cart' ? true : !!previewItem)

  return (
    <FittingRoomContext.Provider value={contextValue}>
      {children}
      <div className={`FittingRoom ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        {/* Drag the left edge to resize the drawer. */}
        <div className="FittingRoom__resizer" onPointerDown={handleResizeStart} aria-hidden />
        <div className="FittingRoom__header">
          <span className="FittingRoom__title">{t('fitting_room.title')}</span>
          <button className="FittingRoom__close" onClick={handleClose} aria-label={t('fitting_room.close')}>
            <Icon name="close" />
          </button>
        </div>
        <div className="FittingRoom__body">
          {isOpen ? <AnimatedBackground /> : null}
          {showPreview && previewProps ? (
            <WearablePreview
              // Remount per outfit/profile — the config lives in the iframe URL.
              key={previewKey}
              id={IFRAME_ID}
              profile={profileAddress}
              {...previewProps}
              peerUrl={peerUrl}
              marketplaceServerUrl={marketplaceServerUrl}
              disableBackground
              dev={isPreviewDev}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : null}
          {isOpen && isLoading ? <Loader active size="large" /> : null}
        </div>
        {mode === 'cart' && wearableItems.length > 0 ? (
          <div className="FittingRoom__items">
            {wearableItems.map(item => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  role="button"
                  className={`FittingRoom__itemChip ${isSelected ? 'is-selected' : ''}`}
                  title={item.name}
                  onClick={() => handleToggleItem(item.id)}
                >
                  <img src={item.thumbnail} alt={item.name} loading="lazy" />
                  <button
                    type="button"
                    className="FittingRoom__itemRemove"
                    aria-label={t('fitting_room.remove_from_cart')}
                    onClick={event => {
                      event.stopPropagation()
                      removeItem(item.id)
                    }}
                  >
                    <Icon name="close" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : null}
        <div className="FittingRoom__footer">
          {mode === 'cart' ? (
            <button type="button" className="FittingRoom__buy">
              <Mana network={Network.MATIC} inline>
                {formatWeiToAssetCard(selectedTotalWei)}
              </Mana>
            </button>
          ) : previewItem ? (
            t('fitting_room.trying_item', { name: previewItem.name })
          ) : (
            t('fitting_room.empty')
          )}
        </div>
      </div>
    </FittingRoomContext.Provider>
  )
}

export default FittingRoomProvider
