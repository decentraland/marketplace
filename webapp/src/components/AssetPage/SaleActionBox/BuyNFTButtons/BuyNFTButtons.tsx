import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'

import { AssetType } from '../../../../modules/asset/types'
import { isNFT } from '../../../../modules/asset/utils'
import { locations } from '../../../../modules/routing/locations'
import styles from './BuyNFTButtons.module.css'
import { Props } from './BuyNFTButtons.types'

const BuyNFTButtons = ({ asset }: Props) => {
  const { contractAddress, network } = asset
  const assetType = isNFT(asset) ? AssetType.NFT : AssetType.ITEM
  const assetId = isNFT(asset) ? asset.tokenId : asset.itemId

  const analytics = getAnalytics()

  const handleBuyWithCard = useCallback(() => {
    analytics.track('Click on go to Buy NFT With Card')
  }, [analytics])

  return (
    <>
      <Button
        as={Link}
        to={locations.buy(assetType, contractAddress, assetId)}
        primary
        fluid
      >
        <Mana inline size="small" network={network} />
        {t('asset_page.actions.buy_with_mana')}
      </Button>

      <Button
        as={Link}
        className={styles.buy_with_card}
        to={locations.buyWithCard(assetType, contractAddress, assetId)}
        onClick={handleBuyWithCard}
        fluid
      >
        <Icon name="credit card outline" />
        {t('asset_page.actions.buy_with_card')}
      </Button>
    </>
  )
}

export default memo(BuyNFTButtons)
