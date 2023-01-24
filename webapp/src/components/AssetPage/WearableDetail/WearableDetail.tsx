import React from 'react'
import { Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import CampaignBadge from '../../Campaign/CampaignBadge'
import { AssetImage } from '../../AssetImage'
import GenderBadge from '../../GenderBadge'
import RarityBadge from '../../RarityBadge'
import { Actions } from '../Actions'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import CategoryBadge from '../CategoryBadge'
import Collection from '../Collection'
import { Description } from '../Description'
import Expiration from '../Expiration'
import { Network } from '../../Network'
import { Owner } from '../Owner'
import Price from '../../Price'
import { SaleActionBox } from '../SaleActionBox'
import SmartBadge from '../SmartBadge'
import { TransactionHistory } from '../TransactionHistory'
import styles from './WearableDetail.module.css'
import { Props } from './WearableDetail.types'

const WearableDetail = ({ nft, isBuyNftsWithFiatEnabled }: Props) => {
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
      box={
        !isBuyNftsWithFiatEnabled ? (
          <>
            <Price asset={nft} />
            <div className="BaseDetail row">
              {nft.issuedId ? (
                <Stats title={t('global.issue_number')}>
                  <Header>
                    {Number(nft.issuedId).toLocaleString()}
                    <span className={styles.issued}>
                      /{Rarity.getMaxSupply(wearable.rarity).toLocaleString()}
                    </span>
                  </Header>
                </Stats>
              ) : null}
              <Network asset={nft} />
            </div>
            <Actions nft={nft} />
            <Expiration />
          </>
        ) : null
      }
      showDetails={isBuyNftsWithFiatEnabled}
      actions={isBuyNftsWithFiatEnabled ? <SaleActionBox asset={nft} /> : null}
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
