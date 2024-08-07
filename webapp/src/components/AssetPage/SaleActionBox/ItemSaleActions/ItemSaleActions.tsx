import { memo } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { AssetType } from '../../../../modules/asset/types'
import { getBuilderCollectionDetailUrl } from '../../../../modules/collection/utils'
import { locations } from '../../../../modules/routing/locations'
import { BuyNFTButtons } from '../BuyNFTButtons'
import { Props } from './ItemSaleActions.types'
import styles from './ItemSaleActions.module.css'

const ItemSaleActions = ({ item, wallet, isBidsOffchainEnabled, customClassnames }: Props) => {
  const isOwner = wallet?.address === item.creator
  const canBuy = !isOwner && item.isOnSale && item.available > 0
  const canBid = isBidsOffchainEnabled && !isOwner && item.available > 0
  const builderCollectionUrl = getBuilderCollectionDetailUrl(item.contractAddress)

  return (
    <>
      {isOwner ? (
        <div className={styles.ownerButtons}>
          <Button as="a" href={builderCollectionUrl} fluid className={customClassnames?.primaryButton}>
            {t('asset_page.actions.edit_price')}
          </Button>
          <Button as="a" href={builderCollectionUrl} fluid className={customClassnames?.secondaryButton}>
            {t('asset_page.actions.change_beneficiary')}
          </Button>
          <Button as="a" href={builderCollectionUrl} fluid className={customClassnames?.outlinedButton}>
            {t('asset_page.actions.mint_item')}
          </Button>
        </div>
      ) : (
        <>
          {canBuy && (
            <BuyNFTButtons asset={item} assetType={AssetType.ITEM} buyWithCardClassName={customClassnames?.buyWithCardClassName} />
          )}
          {canBid && (
            <Button as={Link} role="link" to={locations.bidItem(item.contractAddress, item.itemId)} className={styles.bidButton}>
              {t('asset_page.actions.place_bid')}
            </Button>
          )}
        </>
      )}
    </>
  )
}

export default memo(ItemSaleActions)
