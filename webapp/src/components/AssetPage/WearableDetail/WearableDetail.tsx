import React from 'react'
import { NFTCategory } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import CampaignBadge from '../../Campaign/CampaignBadge'
import { AssetImage } from '../../AssetImage'
import GenderBadge from '../../GenderBadge'
import RarityBadge from '../../RarityBadge'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import CategoryBadge from '../CategoryBadge'
import Collection from '../Collection'
import { Description } from '../Description'
import { Owner } from '../Owner'
import { SaleActionBox } from '../SaleActionBox'
import SmartBadge from '../SmartBadge'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './WearableDetail.types'

const WearableDetail = ({ nft }: Props) => {
  const wearable = nft.data.wearable!

  return (
    <BaseDetail
      asset={nft}
      assetImage={<AssetImage asset={nft} isDraggable />}
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
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
          {wearable.isSmart ? <SmartBadge assetType={AssetType.NFT} /> : null}
          <CampaignBadge contract={nft.contractAddress} />
        </>
      }
      left={
        <>
          <Description text={wearable.description} />
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

export default React.memo(WearableDetail)
