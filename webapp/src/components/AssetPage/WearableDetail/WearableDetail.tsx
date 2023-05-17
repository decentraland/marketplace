import React, { useState } from 'react'
import { NFTCategory, OrderSortBy } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import CampaignBadge from '../../Campaign/CampaignBadge'
import TableContainer from '../../Table/TableContainer'
import { AssetImage } from '../../AssetImage'
import GenderBadge from '../../GenderBadge'
import RarityBadge from '../../RarityBadge'
import { BidsTable } from '../BidsTable'
import { YourOffer } from '../YourOffer'
import CategoryBadge from '../CategoryBadge'
import { ListingsTable } from '../ListingsTable'
import Collection from '../Collection'
import { Description } from '../Description'
import { Owner } from '../Owner'
import SmartBadge from '../SmartBadge'
import { TransactionHistory } from '../TransactionHistory'
import OnBack from '../OnBack'
import Title from '../Title'
import { BuyNFTBox } from '../BuyNFTBox'
import { Props } from './WearableDetail.types'
import styles from './WearableDetail.module.css'

const WearableDetail = ({ nft }: Props) => {
  const wearable = nft.data.wearable!
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

  return (
    <div className={styles.WearableDetail}>
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
                rarity={wearable.rarity}
                assetType={AssetType.NFT}
                category={NFTCategory.WEARABLE}
              />
              <CategoryBadge
                category={wearable.category}
                assetType={AssetType.NFT}
              />
              <GenderBadge
                bodyShapes={wearable.bodyShapes}
                assetType={AssetType.NFT}
                section={Section.WEARABLES}
              />
              {wearable.isSmart ? (
                <SmartBadge assetType={AssetType.NFT} />
              ) : null}
              <CampaignBadge contract={nft.contractAddress} />
            </div>
          </div>
          <Description text={wearable.description} />
          <div>
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

export default React.memo(WearableDetail)
