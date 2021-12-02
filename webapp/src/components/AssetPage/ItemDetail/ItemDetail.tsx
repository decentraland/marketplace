import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './ItemDetail.types'
import Title from '../Title'
import RarityBadge from '../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../GenderBadge'
import CategoryBadge from '../CategoryBadge'
import { Box } from '../../AssetBrowse/Box'
import { Owner } from '../Owner'
import Collection from '../Collection'
import ListedBadge from '../../ListedBadge'
import Price from '../Price'
import styles from './ItemDetail.module.css'

const ItemDetail = ({ item, wallet }: Props) => {
  const wearable = item.data.wearable!
  const isOwner = wallet?.address === item.creator
  const canBuy = !isOwner && item.isOnSale && item.available > 0

  return (
    <div className={styles.detail}>
      <PageHeader>
        <AssetImage asset={item} isDraggable />
        {item.isOnSale && <ListedBadge className={styles.listedBadge} />}
      </PageHeader>
      <Container>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>
              <Title asset={item} />
              <div className={styles.badges}>
                <RarityBadge rarity={item.rarity} assetType={AssetType.ITEM} />
                <CategoryBadge wearable={wearable} assetType={AssetType.ITEM} />
                <GenderBadge wearable={wearable} assetType={AssetType.ITEM} />
              </div>
            </div>
            <Description text={wearable.description} />
            <div className={styles.ownerAndCollection}>
              <Owner asset={item} />
              <Collection asset={item} />
            </div>
          </div>
          <div className={styles.right}>
            <Box className={styles.box}>
              <Price asset={item} />
              <div className={styles.stockAndNetwork}>
                <Stats title={t('asset_page.available')}>
                  {item.available > 0 ? (
                    <Header>
                      {item.available.toLocaleString()}
                      <span className={styles.supply}>
                        /{Rarity.getMaxSupply(item.rarity).toLocaleString()}
                      </span>
                    </Header>
                  ) : (
                    t('asset_page.sold_out')
                  )}
                </Stats>
                <Network asset={item} />
              </div>
              {isOwner ? (
                <div className={styles.ownerButtons}>
                  <Button fluid>EDIT PRICE</Button>
                  <Button fluid>CHANGE BENEFICIARY</Button>
                  <Button fluid>MINT ITEM</Button>
                </div>
              ) : (
                canBuy && (
                  <Button
                    fluid
                    as={Link}
                    to={locations.buy(
                      AssetType.ITEM,
                      item.contractAddress,
                      item.itemId
                    )}
                    primary
                  >
                    {t('asset_page.actions.buy')}
                  </Button>
                )
              )}
            </Box>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default React.memo(ItemDetail)
