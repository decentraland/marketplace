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
import BaseDetail from '../BaseDetail'
import { BidsTable } from '../BidsTable'
import { YourOffer } from '../YourOffer'
import Collection from '../Collection'
import { Description } from '../Description'
import IconBadge from '../IconBadge'
import { Owner } from '../Owner'
import { SaleActionBox } from '../SaleActionBox'
import { ListingsTable } from '../ListingsTable'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './EmoteDetail.types'

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
          <YourOffer nft={nft} />
          <BidsTable nft={nft} />
          <TransactionHistory asset={nft} />
          <TableContainer
            tabsList={tabList}
            handleSortByChange={(value: string) =>
              setSortBy(value as OrderSortBy)
            }
            sortbyList={listingSortByOptions}
            sortBy={sortBy}
            children={
              <ListingsTable asset={nft} sortBy={sortBy as OrderSortBy} />
            }
          />
        </>
      }
    />
  )
}

export default React.memo(EmoteDetail)
