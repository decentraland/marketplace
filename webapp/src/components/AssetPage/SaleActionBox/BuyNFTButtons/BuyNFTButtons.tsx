import { memo, useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Order } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Loader } from 'decentraland-ui'
import { Asset } from '../../../../modules/asset/types'
import { isNFT } from '../../../../modules/asset/utils'
import { locations } from '../../../../modules/routing/locations'
import * as events from '../../../../utils/events'
import { AssetProvider } from '../../../AssetProvider'
import { BuyWithCardButton } from './BuyWithCardButton'
import { BuyWithCryptoButton } from './BuyWithCryptoButton'
import { Props } from './BuyNFTButtons.types'
import styles from './BuyNFTButtons.module.css'

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
  onBuyItemWithCard
}: Props) => {
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
      analytics.track(events.CLICK_GO_TO_BUY_NFT_WITH_CARD)
      !isNFT(asset) ? onBuyItemWithCard(asset) : onExecuteOrderWithCard(asset, order)
    },
    [analytics, onBuyItemWithCard, onExecuteOrderWithCard]
  )

  const handleBuyWithCrypto = useCallback(
    (asset: Asset, order: Order | null) => {
      if (!isConnecting && !wallet && !isBuyingWithCryptoModalOpen) {
        history.replace(locations.signIn(`${location.pathname}?buyWithCrypto=true`))
      } else {
        analytics.track(events.CLICK_BUY_NFT_WITH_CRYPTO)
        onBuyWithCrypto(asset, order)
      }
    },
    [isConnecting, wallet, isBuyingWithCryptoModalOpen, location.pathname, analytics, history, onBuyWithCrypto]
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
              <BuyWithCryptoButton asset={asset} onClick={() => handleBuyWithCrypto(asset, order)} />
              <BuyWithCardButton className={buyWithCardClassName} onClick={() => handleBuyWithCard(asset, order || undefined)} />
            </>
          )
        }}
      </AssetProvider>
    </>
  )
}

export default memo(BuyNFTButtons)
