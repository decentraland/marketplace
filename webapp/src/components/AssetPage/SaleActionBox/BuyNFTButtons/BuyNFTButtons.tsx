import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Order } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Loader } from 'decentraland-ui'
import { config } from '../../../../config'
import { Asset } from '../../../../modules/asset/types'
import { isNFT } from '../../../../modules/asset/utils'
import { useIsIAP } from '../../../../modules/iap/useIAP'
import { getBasename } from '../../../../modules/routing/basename'
import { locations } from '../../../../modules/routing/locations'
import { getTransakPurchase, isTransakSupported } from '../../../../modules/transak/utils'
import * as events from '../../../../utils/events'
import { AssetProvider } from '../../../AssetProvider'
import { BuyWithCardButton } from './BuyWithCardButton'
import { BuyWithCryptoButton } from './BuyWithCryptoButton'
import { Props } from './BuyNFTButtons.types'
import styles from './BuyNFTButtons.module.css'

// A `buyWithCrypto=true` deep link opens the checkout on arrival. It runs from an effect
// rather than during render, and exactly once per mount: the previous call sat in the render
// body, so it re-dispatched on every render, and it called the dispatch prop directly, which
// dropped the credits selection that `handleBuyWithCrypto` carries.
const AutoOpenCheckout = ({
  asset,
  order,
  onOpen
}: {
  asset: Asset
  order: Order | null
  onOpen: (asset: Asset, order: Order | null) => void
}) => {
  const hasOpened = useRef(false)

  useEffect(() => {
    if (hasOpened.current) {
      return
    }
    hasOpened.current = true
    onOpen(asset, order)
  }, [asset, order, onOpen])

  return null
}

const BuyNFTButtons = ({
  credits,
  wallet,
  isConnecting,
  asset,
  assetType,
  tokenId,
  buyWithCardClassName,
  isBuyingWithCryptoModalOpen,
  onBuyWithCrypto,
  onExecuteOrderWithCard,
  onBuyItemWithCard,
  onUseCredits
}: Props) => {
  // Credits are only spent from the mobile in-app view, which always pays with them.
  const isIAP = useIsIAP()
  const analytics = getAnalytics()
  const location = useLocation()

  useEffect(() => {
    if (isIAP) {
      onUseCredits(true)
    }
  }, [isIAP, onUseCredits])
  const shouldOpenBuyWithCryptoModal = useMemo(() => {
    const search = new URLSearchParams(location.search)
    const shouldOpenModal = search.get('buyWithCrypto')
    return shouldOpenModal
  }, [location.search])
  const history = useHistory()

  const handleBuyWithCard = useCallback(
    (asset: Asset, order?: Order) => {
      analytics?.track(events.CLICK_GO_TO_BUY_NFT_WITH_CARD)
      !isNFT(asset) ? onBuyItemWithCard(asset) : onExecuteOrderWithCard(asset, order)
    },
    [analytics, onBuyItemWithCard, onExecuteOrderWithCard]
  )

  const handleBuyWithCrypto = useCallback(
    (asset: Asset, order: Order | null) => {
      if (!isConnecting && !wallet && !isBuyingWithCryptoModalOpen) {
        history.replace(locations.signIn(`${location.pathname}?buyWithCrypto=true`))
      } else {
        analytics?.track(events.CLICK_BUY_NFT_WITH_CRYPTO)
        onBuyWithCrypto(asset, order, isIAP)
      }
    },
    [isConnecting, wallet, isBuyingWithCryptoModalOpen, location.pathname, analytics, history, onBuyWithCrypto, isIAP]
  )

  return (
    <>
      <AssetProvider type={assetType} contractAddress={asset.contractAddress} tokenId={tokenId}>
        {(asset, order) => {
          if (!asset) return <Loader active size="medium" className={styles.loading_asset} />
          // Every branch below carries the same auto-open, so a deep link behaves the same
          // whichever call to action the asset resolves to.
          const withAutoOpen = (children: ReactNode) => (
            <>
              {shouldOpenBuyWithCryptoModal ? <AutoOpenCheckout asset={asset} order={order} onOpen={handleBuyWithCrypto} /> : null}
              {children}
            </>
          )
          if (isIAP) {
            if (!wallet) {
              const basename = getBasename()
              const redirectTo = `${basename}${location.pathname}${location.search}`
              return withAutoOpen(
                <Button
                  primary
                  fluid
                  className={styles.buyWithCryptoButton}
                  onClick={() => window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(redirectTo)}`)}
                >
                  <span>{t('wallet.sign_in')}</span>
                </Button>
              )
            }

            // NFT without an active order cannot be purchased
            if (isNFT(asset) && !order) {
              return withAutoOpen(
                <Button primary fluid className={styles.buyWithCryptoButton} disabled>
                  <span>{t('asset_page.actions.checkout')}</span>
                </Button>
              )
            }

            const assetPrice = !isNFT(asset) ? asset.price : order!.price
            const hasEnoughCredits = !!credits && BigInt(credits.totalCredits) >= BigInt(assetPrice)

            return withAutoOpen(
              <Button
                primary
                fluid
                className={styles.buyWithCryptoButton}
                disabled={!hasEnoughCredits}
                onClick={() => handleBuyWithCrypto(asset, order)}
              >
                <span>{t('asset_page.actions.checkout')}</span>
              </Button>
            )
          }

          return withAutoOpen(
            <>
              <BuyWithCryptoButton
                className={styles.buyWithCryptoButton}
                asset={asset}
                onClick={() => handleBuyWithCrypto(asset, order)}
                isFree={!isNFT(asset) && asset.price === '0'}
              />
              {/* Only when Transak can actually execute what this click would send. The widget needs a
                  registration for the contract the purchase runs through, and it has none for a marketplace
                  version it was never told about — offering the rail then takes the buyer through checkout
                  to a failure the click could have avoided. */}
              {isTransakSupported(getTransakPurchase(asset, order)) ? (
                <BuyWithCardButton className={buyWithCardClassName} onClick={() => handleBuyWithCard(asset, order || undefined)} />
              ) : null}
            </>
          )
        }}
      </AssetProvider>
    </>
  )
}

export default memo(BuyNFTButtons)
