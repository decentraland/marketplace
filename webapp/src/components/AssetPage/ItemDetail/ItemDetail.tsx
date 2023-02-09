import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BodyShape, EmotePlayMode, NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Header, Stats } from 'decentraland-ui'
import { AssetType } from '../../../modules/asset/types'
import { getBuilderCollectionDetailUrl } from '../../../modules/collection/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import GenderBadge from '../../GenderBadge'
import { Network } from '../../Network'
import Price from '../../Price'
import RarityBadge from '../../RarityBadge'
import BaseDetail from '../BaseDetail'
import CategoryBadge from '../CategoryBadge'
import Collection from '../Collection'
import { Description } from '../Description'
import IconBadge from '../IconBadge'
import { Owner } from '../Owner'
import { SaleActionBox } from '../SaleActionBox'
import SmartBadge from '../SmartBadge'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './ItemDetail.types'
import styles from './ItemDetail.module.css'

const ItemDetail = ({ isBuyNftsWithFiatEnabled, item, wallet }: Props) => {
  const isOwner = wallet?.address === item.creator
  const canBuy = !isOwner && item.isOnSale && item.available > 0
  const builderCollectionUrl = getBuilderCollectionDetailUrl(item.contractAddress)

  let description = ''
  let bodyShapes: BodyShape[] = []
  let category
  let loop = false
  switch (item.category) {
    case NFTCategory.WEARABLE:
      description = item.data.wearable!.description
      bodyShapes = item.data.wearable!.bodyShapes
      category = item.data.wearable!.category
      break
    case NFTCategory.EMOTE:
      description = item.data.emote!.description
      bodyShapes = item.data.emote!.bodyShapes
      category = item.data.emote!.category
      loop = item.data.emote!.loop
      break
  }
  const emoteBadgeHref = useMemo(
    () =>
      locations.browse({
        assetType: AssetType.ITEM,
        section: Section.EMOTES,
        emotePlayMode: loop ? [EmotePlayMode.LOOP] : [EmotePlayMode.SIMPLE]
      }),
    [loop]
  )

  return (
    <BaseDetail
      asset={item}
      assetImage={<AssetImage asset={item} isDraggable />}
      isOnSale={item.isOnSale}
      badges={
        <>
          <RarityBadge rarity={item.rarity} assetType={AssetType.ITEM} category={NFTCategory.WEARABLE} />
          {category && (
            <CategoryBadge
              category={item.data.emote ? item.data.emote.category : item.data.wearable!.category}
              assetType={AssetType.ITEM}
            />
          )}
          {item.category === NFTCategory.EMOTE && (
            <IconBadge
              icon={loop ? 'play-loop' : 'play-once'}
              text={t(`emote.play_mode.${loop ? 'loop' : 'simple'}`)}
              href={emoteBadgeHref}
            />
          )}
          {bodyShapes.length > 0 && !item.data.emote && (
            <GenderBadge
              bodyShapes={bodyShapes}
              assetType={AssetType.ITEM}
              section={item.category === NFTCategory.WEARABLE ? Section.WEARABLES : Section.EMOTES}
            />
          )}
          {item.category === NFTCategory.WEARABLE && item.data.wearable!.isSmart && <SmartBadge assetType={AssetType.ITEM} />}

          <CampaignBadge contract={item.contractAddress} />
        </>
      }
      left={
        <>
          <Description text={description} />
          <div className="BaseDetail row">
            <Owner asset={item} />
            <Collection asset={item} />
          </div>
        </>
      }
      box={
        !isBuyNftsWithFiatEnabled ? (
          <>
            {item.isOnSale && <Price asset={item} />}
            <div className="BaseDetail row">
              <Stats title={t('asset_page.stock')}>
                {item.available > 0 ? (
                  <Header>
                    {item.available.toLocaleString()}
                    <span className={styles.supply}>/{Rarity.getMaxSupply(item.rarity).toLocaleString()}</span>
                  </Header>
                ) : (
                  t('asset_page.sold_out')
                )}
              </Stats>
              <Network asset={item} />
            </div>
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
                <Button fluid as={Link} to={locations.buy(AssetType.ITEM, item.contractAddress, item.itemId)} primary>
                  {t('asset_page.actions.buy')}
                </Button>
              )
            )}
          </>
        ) : null
      }
      showDetails={isBuyNftsWithFiatEnabled}
      actions={isBuyNftsWithFiatEnabled ? <SaleActionBox asset={item} /> : null}
      below={<TransactionHistory asset={item} />}
    />
  )
}

export default React.memo(ItemDetail)
