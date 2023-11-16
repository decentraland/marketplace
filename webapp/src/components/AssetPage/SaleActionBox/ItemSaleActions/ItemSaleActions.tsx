import { memo } from 'react'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getBuilderCollectionDetailUrl } from '../../../../modules/collection/utils'
import { AssetType } from '../../../../modules/asset/types'
import { BuyNFTButtons } from '../BuyNFTButtons'
import { Props } from './ItemSaleActions.types'
import styles from './ItemSaleActions.module.css'

const ItemSaleActions = ({ item, wallet, customClassnames }: Props) => {
  const isOwner = wallet?.address === item.creator
  const canBuy = !isOwner && item.isOnSale && item.available > 0
  const builderCollectionUrl = getBuilderCollectionDetailUrl(
    item.contractAddress
  )

  return (
    <>
      {isOwner ? (
        <div className={styles.ownerButtons}>
          <Button
            as="a"
            href={builderCollectionUrl}
            fluid
            className={customClassnames?.primaryButton}
          >
            {t('asset_page.actions.edit_price')}
          </Button>
          <Button
            as="a"
            href={builderCollectionUrl}
            fluid
            className={customClassnames?.secondaryButton}
          >
            {t('asset_page.actions.change_beneficiary')}
          </Button>
          <Button
            as="a"
            href={builderCollectionUrl}
            fluid
            className={customClassnames?.outlinedButton}
          >
            {t('asset_page.actions.mint_item')}
          </Button>
        </div>
      ) : (
        canBuy && (
          <BuyNFTButtons
            asset={item}
            assetType={AssetType.ITEM}
            buyWithCardClassName={customClassnames?.buyWithCardClassName}
          />
        )
      )}
    </>
  )
}

export default memo(ItemSaleActions)
