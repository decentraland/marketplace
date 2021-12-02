import React from 'react'
import { Container, Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './WearableDetail.types'
import Title from '../Title'
import RarityBadge from '../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../GenderBadge'
import CategoryBadge from '../CategoryBadge'
import { Box } from '../../AssetBrowse/Box'
import { Owner } from '../Owner'
import Collection from '../Collection'
import ListedBadge from '../../ListedBadge'
import styles from './WearableDetail.module.css'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'

const WearableDetail = ({ nft }: Props) => {
  const wearable = nft.data.wearable!

  return (
    <div className={styles.detail}>
      <PageHeader>
        <AssetImage asset={nft} isDraggable />
        {!!nft.activeOrderId && <ListedBadge className={styles.listedBadge} />}
      </PageHeader>
      <Container>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>
              <Title asset={nft} />
              <div className={styles.badges}>
                <RarityBadge
                  rarity={wearable.rarity}
                  assetType={AssetType.NFT}
                />
                <CategoryBadge wearable={wearable} assetType={AssetType.NFT} />
                <GenderBadge wearable={wearable} assetType={AssetType.NFT} />
              </div>
            </div>
            <Description text={wearable.description} />
            <div className={styles.ownerAndCollection}>
              <Owner asset={nft} />
              <Collection asset={nft} />
            </div>
          </div>
          <div className={styles.right}>
            <Box className={styles.box}>
              <Price asset={nft} />
              <div className={styles.stockAndNetwork}>
                {nft.issuedId ? (
                  <Stats title={t('global.issue_number')}>
                    <Header>
                      {Number(nft.issuedId).toLocaleString()}
                      <span className="issue-number">
                        /{Rarity.getMaxSupply(wearable.rarity).toLocaleString()}
                      </span>
                    </Header>
                  </Stats>
                ) : null}
                <Network asset={nft} />
              </div>
              <Actions nft={nft} />
              <Expiration />
            </Box>
          </div>
        </div>
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </div>
  )
}

export default React.memo(WearableDetail)
