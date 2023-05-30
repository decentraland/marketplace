import React, { useMemo, useRef } from 'react'
import { BodyShape, EmotePlayMode, NFTCategory, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import RarityBadge from '../../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../../GenderBadge'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import CategoryBadge from '../CategoryBadge'
import SmartBadge from '../SmartBadge'
import { Description } from '../Description'
import { Owner } from '../Owner'
import Collection from '../Collection'
import IconBadge from '../IconBadge'
import { TransactionHistory } from '../TransactionHistory'
import ListingsTableContainer from '../ListingsTableContainer/ListingsTableContainer'
import { BestBuyingOption } from '../BestBuyingOption'
import Title from '../Title'
import OnBack from '../OnBack'
import { Props } from './ItemDetail.types'
import styles from './ItemDetail.module.css'

const ItemDetail = ({ item }: Props) => {
  let description = ''
  let bodyShapes: BodyShape[] = []
  let category
  let loop = false

  const tableRef = useRef<HTMLDivElement>(null)

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
    <div className={styles.ItemDetail}>
      <OnBack asset={item} />
      <div className={styles.informationContainer}>
        <div className={styles.assetImageContainer}>
          <AssetImage asset={item} isDraggable />
        </div>
        <div className={styles.information}>
          <div>
            <Title asset={item} />
            <div className={styles.badges}>
              <RarityBadge
                rarity={item.rarity}
                assetType={AssetType.ITEM}
                category={NFTCategory.WEARABLE}
                size="small"
              />
              {category && (
                <CategoryBadge
                  category={
                    item.data.emote
                      ? item.data.emote.category
                      : item.data.wearable!.category
                  }
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
                  section={
                    item.category === NFTCategory.WEARABLE
                      ? Section.WEARABLES
                      : Section.EMOTES
                  }
                />
              )}
              {item.category === NFTCategory.WEARABLE &&
                item.data.wearable!.isSmart && (
                  <SmartBadge assetType={AssetType.ITEM} />
                )}

              <CampaignBadge contract={item.contractAddress} />
            </div>
          </div>

          <Description text={description} />
          <div
            className={
              item.available > 0 && item.isOnSale
                ? `${styles.itemDetailBottomContainer} ${styles.spaceInMint}`
                : styles.itemDetailBottomContainer
            }
          >
            <div className={styles.basicRow}>
              {item.network === Network.MATIC ? <Owner asset={item} /> : null}
              <Collection asset={item} />
            </div>
            <BestBuyingOption asset={item} tableRef={tableRef} />
          </div>
        </div>
      </div>

      <ListingsTableContainer item={item} ref={tableRef} />
      <TransactionHistory asset={item} />
    </div>
  )
}

export default React.memo(ItemDetail)
