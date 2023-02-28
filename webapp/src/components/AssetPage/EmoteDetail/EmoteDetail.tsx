import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { EmotePlayMode, NFTCategory } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import RarityBadge from '../../RarityBadge'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import Collection from '../Collection'
import { Description } from '../Description'
import IconBadge from '../IconBadge'
import { Owner } from '../Owner'
import { SaleActionBox } from '../SaleActionBox'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './EmoteDetail.types'

const EmoteDetail = ({ nft }: Props) => {
  const emote = nft.data.emote!
  const loop = nft.data.emote!.loop

  const emoteBadgeHref = useMemo(
    () =>
      locations.browse({
        assetType: AssetType.NFT,
        section: Section.EMOTES,
        emotePlayMode: loop ? [EmotePlayMode.LOOP] : [EmotePlayMode.SIMPLE]
      }),
    [loop]
  )

  return (
    <BaseDetail
      asset={nft}
      assetImage={<AssetImage asset={nft} isDraggable />}
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
          <RarityBadge
            rarity={emote.rarity}
            assetType={AssetType.NFT}
            category={NFTCategory.EMOTE}
          />
          <IconBadge
            icon={loop ? 'play-loop' : 'play-once'}
            text={t(`emote.play_mode.${loop ? 'loop' : 'simple'}`)}
            href={emoteBadgeHref}
          />
          <CampaignBadge contract={nft.contractAddress} />
        </>
      }
      left={
        <>
          <Description text={emote.description} />
          <div className="BaseDetail row">
            <Owner asset={nft} />
            <Collection asset={nft} />
          </div>
        </>
      }
      box={null}
      showDetails
      actions={<SaleActionBox asset={nft} />}
      below={
        <>
          <BidList nft={nft} />
          <TransactionHistory asset={nft} />
        </>
      }
    />
  )
}

export default React.memo(EmoteDetail)
