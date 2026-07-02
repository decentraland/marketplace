import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Network, PreviewUnityMode } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon, Loader } from 'decentraland-ui'
import { WearablePreview } from 'decentraland-ui2'
import { config } from '../../config'
import { getIsUnityWearablePreviewEnabled } from '../../modules/features/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import AnimatedBackground from './AnimatedBackground/AnimatedBackground'
import './FittingRoom.css'

const IFRAME_ID = 'fitting-room-iframe'

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
}

const FittingRoomContext = createContext<FittingRoomContextValue | null>(null)

const keyOf = (item: TryOnItem | null): string =>
  item ? `${item.contractAddress ?? ''}:${item.itemId ?? item.tokenId ?? ''}:${item.urn ?? ''}` : ''

export const useFittingRoom = (): FittingRoomContextValue | null => useContext(FittingRoomContext)

// Demo: a "fitting room" drawer that slides in from the right and shows the
// user's avatar wearing the tried-on item, opened from the try-on button on
// the cards. The preview config travels via iframe URL props (same as the
// item detail page — the Unity renderer doesn't support postMessage UPDATEs),
// so switching items remounts the iframe via `key`. While open, the app
// content is pushed left (body class) so BUY MANA and the cart stay visible.
export const FittingRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<TryOnItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const wallet = useSelector(getWallet)
  const profiles = useSelector(getProfiles)
  // Same renderer as the item detail page — Unity has the nicer avatar toon shader.
  const isUnityEnabled = useSelector(getIsUnityWearablePreviewEnabled)
  // Dress the user's own avatar when they're logged in and have a profile.
  const profileAddress = useMemo(() => {
    if (wallet?.address && profiles[wallet.address]?.avatars[0]) {
      return wallet.address.toLowerCase()
    }
    return 'default'
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
    setPreviewItem(prev => {
      if (keyOf(prev) !== keyOf(item)) {
        setIsLoading(true)
      }
      return item
    })
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setPreviewItem(null)
    setIsLoading(false)
  }, [])

  const handleLoad = useCallback(() => setIsLoading(false), [])
  const handleError = useCallback(() => setIsLoading(false), [])

  const contextValue = useMemo<FittingRoomContextValue>(() => ({ tryOn }), [tryOn])

  return (
    <FittingRoomContext.Provider value={contextValue}>
      {children}
      <div className={`FittingRoom ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="FittingRoom__header">
          <span className="FittingRoom__title">{t('fitting_room.title')}</span>
          <button className="FittingRoom__close" onClick={handleClose} aria-label={t('fitting_room.close')}>
            <Icon name="close" />
          </button>
        </div>
        <div className="FittingRoom__body">
          {isOpen ? <AnimatedBackground /> : null}
          {isOpen && previewItem ? (
            <WearablePreview
              // Remount per item/profile — the config lives in the iframe URL.
              key={`${profileAddress}:${keyOf(previewItem)}`}
              id={IFRAME_ID}
              profile={profileAddress}
              // Same addressing as the detail page's try-on: Ethereum items go
              // by urn, everything else by contract + item/token id.
              {...(previewItem.network === Network.ETHEREUM && previewItem.urn
                ? { urns: [previewItem.urn] }
                : {
                    contractAddress: previewItem.contractAddress,
                    itemId: previewItem.itemId ?? undefined,
                    tokenId: previewItem.tokenId ?? undefined
                  })}
              peerUrl={peerUrl}
              marketplaceServerUrl={marketplaceServerUrl}
              disableBackground
              dev={isPreviewDev}
              unity={isUnityEnabled}
              unityMode={PreviewUnityMode.MARKETPLACE}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : null}
          {isOpen && isLoading ? <Loader active size="large" /> : null}
        </div>
        <div className="FittingRoom__footer">
          {previewItem ? t('fitting_room.trying_item', { name: previewItem.name }) : t('fitting_room.empty')}
        </div>
      </div>
    </FittingRoomContext.Provider>
  )
}

export default FittingRoomProvider
