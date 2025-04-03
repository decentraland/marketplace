import { memo, useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Order } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Loader } from 'decentraland-ui'
import { Asset } from '../../../../modules/asset/types'
import { isNFT } from '../../../../modules/asset/utils'
import { locations } from '../../../../modules/routing/locations'
import * as events from '../../../../utils/events'
import { AssetProvider } from '../../../AssetProvider'
import UseCreditsToggle from '../UseCreditsToggle'
import { BuyWithCardButton } from './BuyWithCardButton'
import { BuyWithCryptoButton } from './BuyWithCryptoButton'
import { Props } from './BuyNFTButtons.types'
import styles from './BuyNFTButtons.module.css'

const BuyNFTButtons = ({
  credits,
  wallet,
  isConnecting,
  asset,
  assetType,
  tokenId,
  buyWithCardClassName,
  isBuyingWithCryptoModalOpen,
  isCreditsEnabled,
  isCreditsSecondarySalesEnabled,
  onBuyWithCrypto,
  onExecuteOrderWithCard,
  onBuyItemWithCard,
  onUseCredits
}: Props) => {
  const [useCredits, setUseCredits] = useState(false)
  const analytics = getAnalytics()
  const location = useLocation()
  const shouldOpenBuyWithCryptoModal = useMemo(() => {
    const search = new URLSearchParams(location.search)
    const shouldOpenModal = search.get('buyWithCrypto')
    return shouldOpenModal
  }, [location.search])
  const history = useHistory()

  const handleBuyWithCard = useCallback(
    (asset: Asset, order?: Order) => {
      analytics?.track(events.CLICK_GO_TO_BUY_NFT_WITH_CARD)
      !isNFT(asset) ? onBuyItemWithCard(asset, useCredits) : onExecuteOrderWithCard(asset, order, useCredits)
    },
    [analytics, onBuyItemWithCard, onExecuteOrderWithCard, useCredits]
  )

  const handleBuyWithCrypto = useCallback(
    (asset: Asset, order: Order | null) => {
      if (!isConnecting && !wallet && !isBuyingWithCryptoModalOpen) {
        history.replace(locations.signIn(`${location.pathname}?buyWithCrypto=true`))
      } else {
        analytics?.track(events.CLICK_BUY_NFT_WITH_CRYPTO)
        onBuyWithCrypto(asset, order, useCredits)
      }
    },
    [isConnecting, wallet, isBuyingWithCryptoModalOpen, location.pathname, analytics, history, onBuyWithCrypto, useCredits]
  )

  const handleUseCredits = useCallback(
    (value: boolean) => {
      setUseCredits(value)
      onUseCredits(value)
    },
    [onUseCredits]
  )

  return (
    <>
      <AssetProvider type={assetType} contractAddress={asset.contractAddress} tokenId={tokenId}>
        {(asset, order) => {
          if (!asset) return <Loader active size="medium" className={styles.loading_asset} />
          if (asset && shouldOpenBuyWithCryptoModal) {
            onBuyWithCrypto(asset, order)
          }
          const isItemFree = !isNFT(asset) && asset.price === '0'
          const isBuyingEntirelyWithCredits =
            useCredits &&
            !!credits &&
            ((!isNFT(asset) && BigInt(credits.totalCredits) >= BigInt(asset.price)) ||
              (isNFT(asset) && order && BigInt(credits.totalCredits) >= BigInt(order.price)))
          const isFree = isItemFree || !!isBuyingEntirelyWithCredits

          return (
            <>
              {/* Credits toggle is only available for items or for NFTs as well if the secondary sales are enabled */}
              {((isCreditsEnabled && !isNFT(asset) && BigInt(asset.price) > 0) ||
                (isCreditsEnabled && isCreditsSecondarySalesEnabled && isNFT(asset))) && (
                <UseCreditsToggle
                  asset={asset}
                  assetPrice={!isNFT(asset) ? asset.price : order ? order.price : undefined}
                  useCredits={useCredits}
                  onUseCredits={handleUseCredits}
                />
              )}
              <BuyWithCryptoButton asset={asset} onClick={() => handleBuyWithCrypto(asset, order)} isFree={isFree} />
              {!isFree && (
                <BuyWithCardButton className={buyWithCardClassName} onClick={() => handleBuyWithCard(asset, order || undefined)} />
              )}
            </>
          )
        }}
      </AssetProvider>
    </>
  )
}

export default memo(BuyNFTButtons)
