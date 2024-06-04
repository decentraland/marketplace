import React, { useMemo, useState } from 'react'
import { EmotePlayMode, OrderSortBy } from '@dcl/schemas'
import { RarityBadge } from 'decentraland-dapps/dist/containers/RarityBadge'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import TableContainer from '../../Table/TableContainer'
import { AssetUtility } from '../AssetUtility'
import { BidsTable } from '../BidsTable'
import { BuyNFTBox } from '../BuyNFTBox'
import Collection from '../Collection'
import { Description } from '../Description'
import IconBadge from '../LinkedIconBadge'
import { ListingsTable } from '../ListingsTable'
import OnBack from '../OnBack'
import { Owner } from '../Owner'
import Title from '../Title'
import { TransactionHistory } from '../TransactionHistory'
import { UtilityBadge } from '../UtilityBadge'
import { YourOffer } from '../YourOffer'
import { Props } from './EmoteDetail.types'
import styles from './EmoteDetail.module.css'

const EmoteDetail = ({ nft }: Props) => {
  const emote = nft.data.emote!
  const loop = nft.data.emote!.loop
  const [sortBy, setSortBy] = useState<OrderSortBy>(OrderSortBy.CHEAPEST)

  const tabList = [
    {
      value: 'other_available_listings',
      displayValue: t('listings_table.other_available_listings')
    }
  ]

  const listingSortByOptions = [
    {
      text: t('listings_table.cheapest'),
      value: OrderSortBy.CHEAPEST
    },
    {
      text: t('listings_table.newest'),
      value: OrderSortBy.RECENTLY_LISTED
    },
    {
      text: t('listings_table.oldest'),
      value: OrderSortBy.OLDEST
    },
    {
      text: t('listings_table.issue_number_asc'),
      value: OrderSortBy.ISSUED_ID_ASC
    },
    {
      text: t('listings_table.issue_number_desc'),
      value: OrderSortBy.ISSUED_ID_DESC
    }
  ]

  const emoteBadgeHref = useMemo(
    () =>
      locations.browse({
        assetType: AssetType.NFT,
        section: Section.EMOTES,
        emotePlayMode: loop ? [EmotePlayMode.LOOP] : [EmotePlayMode.SIMPLE]
      }),
    [loop]
  )

  const emoteSoundHref = locations.browse({
    assetType: AssetType.ITEM,
    section: Section.EMOTES,
    emoteHasSound: true
  })

  const emoteGeometryHref = locations.browse({
    assetType: AssetType.ITEM,
    section: Section.EMOTES,
    emoteHasGeometry: true
  })

  return (
    <div className={styles.EmoteDetail}>
      <OnBack asset={nft} />
      <div className={styles.assetImageContainer}>
        <AssetImage asset={nft} isDraggable />
      </div>
      <div className={styles.wearableInformationContainer}>
        <div className={styles.wearableInformation}>
          <div>
            <Title asset={nft} />
            <div className={styles.badges}>
              <RarityBadge rarity={emote.rarity} size="medium" withTooltip />
              <IconBadge
                icon={loop ? 'play-loop' : 'play-once'}
                text={t(`emote.play_mode.${loop ? 'loop' : 'simple'}`)}
                href={emoteBadgeHref}
              />
              {nft.utility ? <UtilityBadge /> : null}
              <CampaignBadge contract={nft.contractAddress} />
              {emote.hasSound && <IconBadge icon="sound" text={t('emote.sound')} href={emoteSoundHref} />}
              {emote.hasGeometry && <IconBadge icon="props" text={t('emote.props')} href={emoteGeometryHref} />}
            </div>
          </div>
          <div className={styles.attributesRow}>
            <div className={styles.attributesColumn}>
              <Description text={emote.description} />
            </div>
            {nft.utility ? (
              <div className={styles.attributesColumn}>
                <AssetUtility utility={nft.utility} />
              </div>
            ) : null}
          </div>
          <div className={styles.attributesRow}>
            <div className={styles.attributesColumn}>
              <Owner asset={nft} />
            </div>
            <div className={styles.attributesColumn}>
              <Collection asset={nft} />
            </div>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <BuyNFTBox nft={nft} />
        </div>
      </div>
      <YourOffer nft={nft} />
      <BidsTable nft={nft} />
      <TransactionHistory asset={nft} />
      <TableContainer
        tabsList={tabList}
        handleSortByChange={(value: string) => setSortBy(value as OrderSortBy)}
        sortbyList={listingSortByOptions}
        sortBy={sortBy}
        children={<ListingsTable asset={nft} sortBy={sortBy as OrderSortBy} />}
      />
    </div>
  )
}

export default React.memo(EmoteDetail)
