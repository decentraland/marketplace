import React from 'react'
import { Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './EmoteDetail.types'
import RarityBadge from '../../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import GenderBadge from '../../GenderBadge'
import { Owner } from '../Owner'
import Collection from '../Collection'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { TransactionHistory } from '../TransactionHistory'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'
import styles from './EmoteDetail.module.css'

const EmoteDetail = ({ nft }: Props) => {
  const emote = nft.data.emote!

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
          <GenderBadge
            bodyShapes={emote.bodyShapes}
            assetType={AssetType.NFT}
            section={Section.EMOTES}
          />
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
