import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, Mana } from 'decentraland-ui'
import { AssetType } from '../../../../modules/asset/types'
import { isNFT } from '../../../../modules/asset/utils'
import { locations } from '../../../../modules/routing/locations'
import { Props } from './BuyNFTButtons.types'
import styles from './BuyNFTButtons.module.css'

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
      <Button as={Link} to={locations.buy(assetType, contractAddress, assetId)} primary fluid>
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
