import React, { useMemo } from 'react'
import { Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { EmotePlayMode, NFTCategory, Rarity } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import RarityBadge from '../../RarityBadge'
import { AssetImage } from '../../AssetImage'
import { Network } from '../Network'
import { Owner } from '../Owner'
import Collection from '../Collection'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { Description } from '../Description'
import IconBadge from '../IconBadge'
import CampaignBadge from '../../Campaign/CampaignBadge'
import BaseDetail from '../BaseDetail'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './EmoteDetail.types'
import styles from './EmoteDetail.module.css'

const EmoteDetail = ({ nft }: Props) => {
  const emote = nft.data.emote!
  const loop = nft.data.emote!.loop

  const emoteBadgeHref = useMemo(
    () =>
      locations.browse({
        assetType: AssetType.NFT,
        section: Section.EMOTES,
        emotePlayMode: loop ? EmotePlayMode.LOOP : EmotePlayMode.SIMPLE
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
      box={
        <>
          <Price asset={nft} />
          <div className="BaseDetail row">
            {nft.issuedId ? (
              <Stats title={t('global.issue_number')}>
                <Header>
                  {Number(nft.issuedId).toLocaleString()}
                  <span className={styles.issued}>
                    /{Rarity.getMaxSupply(emote.rarity).toLocaleString()}
                  </span>
                </Header>
              </Stats>
            ) : null}
            <Network asset={nft} />
          </div>
          <Actions nft={nft} />
          <Expiration />
        </>
      }
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
