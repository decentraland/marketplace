import React from 'react'
import { Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './WearableDetail.types'
import RarityBadge from '../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../GenderBadge'
import CategoryBadge from '../CategoryBadge'
import { Owner } from '../Owner'
import Collection from '../Collection'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { TransactionHistory } from '../TransactionHistory'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'
import styles from './WearableDetail.module.css'

const WearableDetail = ({ nft }: Props) => {
  const wearable = nft.data.wearable!

  return (
    <BaseDetail
      asset={nft}
      assetImage={<AssetImage asset={nft} isDraggable />}
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
          <RarityBadge rarity={wearable.rarity} assetType={AssetType.NFT} />
          <CategoryBadge wearable={wearable} assetType={AssetType.NFT} />
          <GenderBadge wearable={wearable} assetType={AssetType.NFT} />
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

export default React.memo(WearableDetail)
