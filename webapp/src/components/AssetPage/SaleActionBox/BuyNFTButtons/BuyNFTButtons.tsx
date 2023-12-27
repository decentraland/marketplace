import { memo, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Icon, Loader, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { locations } from '../../../../modules/routing/locations'
import { isNFT } from '../../../../modules/asset/utils'
import { Asset } from '../../../../modules/asset/types'
import { AssetProvider } from '../../../AssetProvider'
import * as events from '../../../../utils/events'
import styles from './BuyNFTButtons.module.css'
import { Props } from './BuyNFTButtons.types'

const BuyNFTButtons = ({
  wallet,
  isConnecting,
  asset,
  assetType,
  tokenId,
  buyWithCardClassName,
  isBuyCrossChainEnabled,
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
  const assetId = tokenId || asset.itemId

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
    [
      isConnecting,
      wallet,
      isBuyingWithCryptoModalOpen,
      location.pathname,
      analytics,
      onRedirect,
      onBuyWithCrypto
    ]
  )

  return (
    <>
      <AssetProvider
        type={assetType}
        contractAddress={asset.contractAddress}
        tokenId={tokenId}
      >
        {(asset, order) => {
          if (!asset)
            return (
              <Loader active size="medium" className={styles.loading_asset} />
            )
          if (asset && shouldOpenBuyWithCryptoModal) {
            onBuyWithCrypto(asset, order)
          }
          return (
            <>
              {isBuyCrossChainEnabled ? (
                <Button
                  onClick={() => handleBuyWithCrypto(asset, order)}
                  primary
                  fluid
                >
                  <Mana
                    showTooltip
                    inline
                    size="small"
                    network={asset.network}
                  />
                  {t('asset_page.actions.buy_with_crypto')}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={locations.buy(
                    assetType,
                    asset.contractAddress,
                    assetId ?? undefined
                  )}
                  primary
                  fluid
                >
                  <Mana
                    showTooltip
                    inline
                    size="small"
                    network={asset.network}
                  />
                  {t('asset_page.actions.buy_with_mana')}
                </Button>
              )}

              <Button
                className={`${styles.buy_with_card} ${buyWithCardClassName}`}
                onClick={() => handleBuyWithCard(asset)}
                fluid
              >
                <Icon name="credit card outline" />
                {t('asset_page.actions.buy_with_card')}
              </Button>
            </>
          )
        }}
      </AssetProvider>
    </>
  )
}

export default memo(BuyNFTButtons)
