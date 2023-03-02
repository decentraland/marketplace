import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { BodyShape, EmotePlayMode, NFTCategory } from '@dcl/schemas'
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
import BaseDetail from '../BaseDetail'
import IconBadge from '../IconBadge'
import { TransactionHistory } from '../TransactionHistory'
import { SaleActionBox } from '../SaleActionBox'
import { Props } from './ItemDetail.types'

const ItemDetail = ({ item }: Props) => {
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
          <RarityBadge
            rarity={item.rarity}
            assetType={AssetType.ITEM}
            category={NFTCategory.WEARABLE}
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
      box={null}
      showDetails
      actions={<SaleActionBox asset={item} />}
      below={<TransactionHistory asset={item} />}
    />
  )
}

export default React.memo(ItemDetail)
