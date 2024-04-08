import React, { useState } from 'react'
import { OrderSortBy } from '@dcl/schemas'
import { RarityBadge } from 'decentraland-dapps/dist/containers/RarityBadge'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import GenderBadge from '../../GenderBadge'
import TableContainer from '../../Table/TableContainer'
import { BidsTable } from '../BidsTable'
import { BuyNFTBox } from '../BuyNFTBox'
import CategoryBadge from '../CategoryBadge'
import Collection from '../Collection'
import { Description } from '../Description'
import { ListingsTable } from '../ListingsTable'
import OnBack from '../OnBack'
import { Owner } from '../Owner'
import { RequiredPermissions } from '../RequiredPermissions'
import SmartBadge from '../SmartBadge'
import Title from '../Title'
import { TransactionHistory } from '../TransactionHistory'
import { YourOffer } from '../YourOffer'
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
          <div className={styles.wearableBadgesContainer}>
            <Title asset={nft} />
            <div className={styles.badges}>
              <RarityBadge rarity={wearable.rarity} withTooltip size="medium" />
              <CategoryBadge category={wearable.category} assetType={AssetType.NFT} />
              <GenderBadge bodyShapes={wearable.bodyShapes} assetType={AssetType.NFT} section={Section.WEARABLES} />
              {wearable.isSmart ? <SmartBadge assetType={AssetType.NFT} /> : null}
              <CampaignBadge contract={nft.contractAddress} />
            </div>
          </div>
          <Description text={wearable.description} />
          {wearable.isSmart ? <RequiredPermissions asset={nft} /> : null}
          <div className={styles.wearableOwnerAndCollectionContainer}>
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
