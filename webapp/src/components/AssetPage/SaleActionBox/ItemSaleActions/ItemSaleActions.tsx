import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { getBuilderCollectionDetailUrl } from '../../../../modules/collection/utils'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import styles from './ItemSaleActions.module.css'
import { Props } from './ItemSaleActions.types'

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
        canBuy && (
          <>
            <Button
              as={Link}
              to={locations.buyWithMana(
                AssetType.NFT,
                item.contractAddress,
                item.itemId
              )}
              primary
              fluid
            >
              <Mana inline size="small" network={item.network} />
              {t('asset_page.actions.buy_with_mana')}
            </Button>
            <Button
              as={Link}
              className={styles.buy_with_card}
              to={locations.buyWithCard(
                AssetType.NFT,
                item.contractAddress,
                item.itemId
              )}
              fluid
            >
              <Icon name="credit card outline" />
              {t('asset_page.actions.buy_with_card')}
            </Button>
          </>
        )
      )}
    </>
  )
}

export default memo(NFTSaleActions)
