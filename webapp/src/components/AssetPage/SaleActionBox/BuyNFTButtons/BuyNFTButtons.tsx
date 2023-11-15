import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Mana } from 'decentraland-ui'
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
  asset,
  assetType,
  tokenId,
  buyWithCardClassName,
  isBuyCrossChainEnabled,
  onBuyWithCrypto,
  onExecuteOrderWithCard,
  onBuyItemWithCard
}: Props) => {
  const analytics = getAnalytics()
  const assetId = tokenId || asset.itemId

  const handleBuyWithCard = useCallback(
    (asset: Asset) => {
      analytics.track(events.CLICK_GO_TO_BUY_NFT_WITH_CARD)
      !isNFT(asset) ? onBuyItemWithCard(asset) : onExecuteOrderWithCard(asset)
    },
    [analytics, onBuyItemWithCard, onExecuteOrderWithCard]
  )

  return (
    <>
      <AssetProvider
        type={assetType}
        contractAddress={asset.contractAddress}
        tokenId={tokenId}
      >
        {(asset, order) => {
          if (!asset) return null
          return (
            <>
              {isBuyCrossChainEnabled ? (
                <Button
                  onClick={() => onBuyWithCrypto(asset, order)}
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
