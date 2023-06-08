import React, { useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { EmotePlayMode, NFTCategory, OrderSortBy } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import TableContainer from '../../Table/TableContainer'
import RarityBadge from '../../RarityBadge'
import { BidsTable } from '../BidsTable'
import { YourOffer } from '../YourOffer'
import Collection from '../Collection'
import { Description } from '../Description'
import IconBadge from '../IconBadge'
import { Owner } from '../Owner'
import { ListingsTable } from '../ListingsTable'
import { TransactionHistory } from '../TransactionHistory'
import OnBack from '../OnBack'
import Title from '../Title'
import { BuyNFTBox } from '../BuyNFTBox'
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
            </div>
          </div>
          <Description text={emote.description} />
          <div className={styles.emoteOwnerAndCollectionContainer}>
            <Owner asset={nft} />
            <Collection asset={nft} />
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
