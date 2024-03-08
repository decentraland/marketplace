import { memo, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Loader } from 'decentraland-ui'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { locations } from '../../../../modules/routing/locations'
import { isNFT } from '../../../../modules/asset/utils'
import { Asset } from '../../../../modules/asset/types'
import { AssetProvider } from '../../../AssetProvider'
import * as events from '../../../../utils/events'
import styles from './BuyNFTButtons.module.css'
import { Props } from './BuyNFTButtons.types'
import { BuyWithCardButton } from './BuyWithCardButton'
import { BuyWithCryptoButton } from './BuyWithCryptoButton'

const BuyNFTButtons = ({
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
  onRedirect
}: Props) => {
  const analytics = getAnalytics()
  const location = useLocation()
  const shouldOpenBuyWithCryptoModal = useMemo(() => {
    const search = new URLSearchParams(location.search)
    const shouldOpenModal = search.get('buyWithCrypto')
    return shouldOpenModal
  }, [location.search])

  const handleBuyWithCard = useCallback(
    (asset: Asset) => {
      analytics.track(events.CLICK_GO_TO_BUY_NFT_WITH_CARD)
      !isNFT(asset) ? onBuyItemWithCard(asset) : onExecuteOrderWithCard(asset)
    },
    [analytics, onBuyItemWithCard, onExecuteOrderWithCard]
  )

  const handleBuyWithCrypto = useCallback(
    (asset, order) => {
      if (!isConnecting && !wallet && !isBuyingWithCryptoModalOpen) {
        onRedirect(locations.signIn(`${location.pathname}?buyWithCrypto=true`))
      } else {
        analytics.track(events.CLICK_BUY_NFT_WITH_CRYPTO)
        onBuyWithCrypto(asset, order)
      }
    },
    [isConnecting, wallet, isBuyingWithCryptoModalOpen, location.pathname, analytics, onRedirect, onBuyWithCrypto]
  )

  return (
    <>
      <AssetProvider type={assetType} contractAddress={asset.contractAddress} tokenId={tokenId}>
        {(asset, order) => {
          if (!asset) return <Loader active size="medium" className={styles.loading_asset} />
          if (asset && shouldOpenBuyWithCryptoModal) {
            onBuyWithCrypto(asset, order)
          }
          return (
            <>
              <BuyWithCryptoButton onClick={() => handleBuyWithCrypto(asset, order)} />
              <BuyWithCardButton className={buyWithCardClassName} onClick={() => handleBuyWithCard(asset)} />
            </>
          )
        }}
      </AssetProvider>
    </>
  )
}

export default memo(BuyNFTButtons)
