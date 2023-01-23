import { memo } from 'react'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { getBuilderCollectionDetailUrl } from '../../../../modules/collection/utils'
import styles from './ItemSaleActions.module.css'
import { Props } from './ItemSaleActions.types'
import { BuyNFTButtons } from '../BuyNFTButtons'

const NFTSaleActions = ({ item, wallet }: Props) => {
  const isOwner = wallet?.address === item.creator
  const canBuy = !isOwner && item.isOnSale && item.available > 0
  const builderCollectionUrl = getBuilderCollectionDetailUrl(
    item.contractAddress
  )

  return (
    <>
      {isOwner ? (
        <div className={styles.ownerButtons}>
          <Button as="a" href={builderCollectionUrl} fluid>
            {t('asset_page.actions.edit_price')}
          </Button>
          <Button as="a" href={builderCollectionUrl} fluid>
            {t('asset_page.actions.change_beneficiary')}
          </Button>
          <Button as="a" href={builderCollectionUrl} fluid>
            {t('asset_page.actions.mint_item')}
          </Button>
        </div>
      ) : (
        canBuy && <BuyNFTButtons asset={item} />
      )}
    </>
  )
}

export default memo(NFTSaleActions)
